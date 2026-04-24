import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAdminConfig, setAdminConfig, DEFAULT_CONFIG, AdminConfig } from "@/lib/admin-config"
import { verifyAdminPassword } from "@/app/actions/events"

export async function GET() {
  const config = await getAdminConfig()
  // Prevent Next.js / CDN from caching the config response so the admin panel
  // always receives the latest saved values after a page refresh.
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  })
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
      ...DEFAULT_CONFIG,
      ...config,
      fonts: {
        ...DEFAULT_CONFIG.fonts,
        ...config.fonts,
      },
      images: {
        ...DEFAULT_CONFIG.images,
        ...config.images,
      },
    })

    // Bust the Next.js full-route cache so the root layout re-renders with the
    // newly saved fonts and images on the very next page load (no hard-refresh
    // or re-deploy required).
    revalidatePath("/", "layout")

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save config"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
