import { NextRequest, NextResponse } from "next/server"
import { getAdminConfig, setAdminConfig, AdminConfig } from "@/lib/admin-config"
import { verifyAdminPassword } from "@/app/actions/events"

export async function GET() {
  const config = await getAdminConfig()
  return NextResponse.json(config)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, config } = body as { password: string; config: AdminConfig }

    if (!password || !(await verifyAdminPassword(password))) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 })
    }

    if (!config || typeof config !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid config" }, { status: 400 })
    }

    await setAdminConfig({
      fonts: {
        heading: config.fonts?.heading ?? null,
        body: config.fonts?.body ?? null,
        button: config.fonts?.button ?? null,
      },
      images: {
        logo: config.images?.logo ?? null,
        heroPoster: config.images?.heroPoster ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save config"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
