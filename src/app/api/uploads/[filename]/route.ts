import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  // Prevent path traversal
  const safe = path.basename(filename)
  const filePath = path.join("/tmp", "uploads", safe)

  try {
    const buffer = await fs.readFile(filePath)
    const ext = safe.split(".").pop()?.toLowerCase() ?? ""
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream"
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
