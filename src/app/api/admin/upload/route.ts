import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { verifyAdminPassword } from "@/app/actions/events"

const VALID_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

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

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadsDir, filename)

    const arrayBuffer = await file.arrayBuffer()
    await fs.writeFile(filePath, new Uint8Array(arrayBuffer))

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
