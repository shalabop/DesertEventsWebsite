/*
 * Instagram Basic Display API / Graph API proxy.
 *
 * Required environment variables (set in Vercel → Settings → Environment Variables):
 *   INSTAGRAM_ACCESS_TOKEN  — Long-lived user access token from Meta Developer App.
 *   INSTAGRAM_USER_ID       — Optional. If omitted the route uses the token's "me" endpoint.
 *
 * The access token must be a long-lived token (60-day TTL). You should refresh it
 * periodically via Meta's token refresh endpoint or a cron job.
 *
 * API reference:
 *   https://developers.facebook.com/docs/instagram-basic-display-api/reference/media
 */
import { NextRequest, NextResponse } from "next/server"

export interface InstagramMediaItem {
  id: string
  caption?: string
  media_url: string
  permalink: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  thumbnail_url?: string
  timestamp: string
}

const FIELDS = "id,caption,media_url,permalink,media_type,thumbnail_url,timestamp"

export async function GET(request: NextRequest) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "INSTAGRAM_ACCESS_TOKEN is not configured. Add it to your environment variables.",
        posts: [],
      },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get("limit") ?? "9"), 24)

  try {
    // Use Graph API v18 media endpoint.
    const baseUrl = userId
      ? `https://graph.instagram.com/${userId}/media`
      : "https://graph.instagram.com/me/media"

    const apiUrl = `${baseUrl}?fields=${FIELDS}&limit=${limit}&access_token=${token}`

    const res = await fetch(apiUrl, { next: { revalidate: 600 } }) // cache 10 min

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const message = (errBody as { error?: { message?: string } })?.error?.message ?? `Instagram API responded with ${res.status}`
      return NextResponse.json({ ok: false, error: message, posts: [] }, { status: 502 })
    }

    const body = await res.json() as { data: InstagramMediaItem[] }
    const posts: InstagramMediaItem[] = (body.data ?? []).map((item) => ({
      id: item.id,
      caption: item.caption,
      media_url: item.media_url,
      permalink: item.permalink,
      media_type: item.media_type,
      thumbnail_url: item.thumbnail_url,
      timestamp: item.timestamp,
    }))

    return NextResponse.json({ ok: true, posts })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch Instagram posts."
    return NextResponse.json({ ok: false, error: message, posts: [] }, { status: 500 })
  }
}
