/*
 * Root cause: Vercel serverless functions have a hard 4.5 MB request-body limit.
 * Video files routinely exceed this, so funnelling the upload through a Next.js
 * API route is not viable.
 *
 * Fix: Return a Supabase Storage signed-upload URL so the browser can PUT the
 * video file directly to Supabase — the request never touches the Vercel function
 * body size limit.  The public URL is then saved to admin config by the client.
 *
 * Recommended max file size: 500 MB (Supabase Storage default).
 * Supported formats: MP4, WebM, MOV, OGG.
 */
import { NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/app/actions/events"
import { getAdminSupabase } from "@/lib/supabase"

const BUCKET = "hero-videos"

const VALID_VIDEO_TYPES: Record<string, string> = {
  "video/mp4":       "mp4",
  "video/webm":      "webm",
  "video/quicktime": "mov",
  "video/ogg":       "ogg",
}

export async function POST(request: NextRequest) {
  try {
    const { password, mimeType, filename } = await request.json() as {
      password: string
      mimeType: string
      filename: string
    }

    if (!password || !(await verifyAdminPassword(password))) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 })
    }

    const ext = VALID_VIDEO_TYPES[mimeType]
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "Unsupported video type. Use MP4, WebM, MOV, or OGG." },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabase()
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your Vercel environment variables." },
        { status: 500 }
      )
    }

    // Derive a safe filename from the original name so the URL is readable.
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `hero-${Date.now()}-${safeName}`

    // Generate a signed upload URL valid for 60 minutes.
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath)

    if (error) {
      // If the bucket doesn't exist yet, give a helpful message.
      if (error.message.toLowerCase().includes("bucket")) {
        return NextResponse.json(
          { ok: false, error: `Storage bucket '${BUCKET}' not found. Create a public bucket named '${BUCKET}' in Supabase Storage.` },
          { status: 500 }
        )
      }
      throw error
    }

    // Build the public URL that will be stored in admin config after the upload.
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    return NextResponse.json({
      ok: true,
      signedUrl: data.signedUrl,
      token: data.token,
      publicUrl: urlData.publicUrl,
      path: storagePath,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create upload URL"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
