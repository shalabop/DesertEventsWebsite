/*
 * Generates a Supabase Storage signed-upload URL for venue hover videos.
 * The browser PUTs the video directly to Supabase so the file never passes
 * through Vercel's 4.5 MB serverless body limit.
 *
 * Bucket: "venue-videos"  (must be created as a public bucket in Supabase Storage)
 * Supported formats: MP4, WebM, MOV, OGG
 */
import { NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/app/actions/events"
import { getAdminSupabase } from "@/lib/supabase"

const BUCKET = "venue-videos"

const VALID_VIDEO_TYPES: Record<string, string> = {
  "video/mp4":       "mp4",
  "video/webm":      "webm",
  "video/quicktime": "mov",
  "video/ogg":       "ogg",
}

export async function POST(request: NextRequest) {
  try {
    const { password, mimeType, filename, venueName } = await request.json() as {
      password: string
      mimeType: string
      filename: string
      venueName?: string
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
        { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables." },
        { status: 500 }
      )
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    const venueSlug = venueName ? venueName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "venue"
    const storagePath = `${venueSlug}-${Date.now()}-${safeName}`

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath)

    if (error) {
      if (error.message.toLowerCase().includes("bucket")) {
        return NextResponse.json(
          { ok: false, error: `Storage bucket '${BUCKET}' not found. Create a public bucket named '${BUCKET}' in Supabase Storage.` },
          { status: 500 }
        )
      }
      throw error
    }

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
