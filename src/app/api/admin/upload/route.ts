import { NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/app/actions/events"
import { getServerSupabase } from "@/lib/supabase"

const VALID_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const BUCKET = "admin-uploads"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const password = formData.get("password")
    if (typeof password !== "string" || !(await verifyAdminPassword(password))) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 })
    }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 })
    }

    const ext = VALID_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "Invalid file type. Supported: JPG, PNG, WebP, GIF." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, error: "File too large. Maximum size is 5 MB." },
        { status: 400 }
      )
    }

    const supabase = getServerSupabase()
    const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, new Uint8Array(arrayBuffer), { contentType: file.type })

    if (error) throw new Error(error.message)

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return NextResponse.json({ ok: true, url: urlData.publicUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
