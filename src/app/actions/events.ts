"use server"

import { getServerSupabase, getAdminSupabase } from "@/lib/supabase"

export type EventType = "le-tour-de-crawl" | "society-sessions" | "scottsdale-guestlist" | "other"

export interface EventData {
  id?: string
  title: string
  date: string
  time: string
  venue: string
  city: string
  type: EventType
  image: string
  description: string
  ticket_link: string
  /** Optional hover video URL shown when mousing over the event card. */
  hover_video?: string | null
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "desertevent2024"

export async function verifyAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function getEvents(): Promise<{ ok: boolean; data: EventData[]; error?: string }> {
  let supabase: ReturnType<typeof getServerSupabase>
  try {
    supabase = getServerSupabase()
  } catch {
    return { ok: false, data: [], error: "SUPABASE_URL or SUPABASE_ANON_KEY is not configured." }
  }
  if (!supabase) {
    return { ok: false, data: [], error: "SUPABASE_URL or SUPABASE_ANON_KEY is not configured." }
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })

    if (error) {
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return { ok: false, data: [], error: "The 'events' table does not exist. Run the SQL setup in Supabase." }
      }
      return { ok: false, data: [], error: error.message }
    }

    return { ok: true, data: data || [] }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error fetching events."
    return { ok: false, data: [], error: msg }
  }
}

export async function createEvent(event: EventData, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  const supabase = getAdminSupabase()
  if (!supabase) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables and redeploy." }
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .insert([{
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        type: event.type,
        image: event.image || "/gallery/1.jpg",
        description: event.description,
        ticket_link: event.ticket_link || "#",
        hover_video: event.hover_video ?? null,
      }])
      .select()
      .single()

    if (error) {
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return { ok: false, error: "The 'events' table does not exist. Run the SQL setup in Supabase first." }
      }
      return { ok: false, error: error.message }
    }

    return { ok: true, data }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create event." }
  }
}

export async function updateEvent(id: string, event: Partial<EventData>, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  const supabase = getAdminSupabase()
  if (!supabase) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables and redeploy." }
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .update({
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        type: event.type,
        image: event.image,
        description: event.description,
        ticket_link: event.ticket_link,
        // Only include hover_video when explicitly provided — omitting it prevents
        // a partial update from silently clearing an existing hover video URL.
        ...("hover_video" in event && { hover_video: event.hover_video ?? null }),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return { ok: false, error: error.message }
    return { ok: true, data }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update event." }
  }
}

export async function deleteEvent(id: string, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  const supabase = getAdminSupabase()
  if (!supabase) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables and redeploy." }
  }

  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete event." }
  }
}

export async function uploadEventImage(formData: FormData, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  const supabase = getAdminSupabase()
  if (!supabase) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables and redeploy." }
  }

  try {
    const file = formData.get("file") as File
    if (!file) return { ok: false, error: "No file provided" }

    const VALID_TYPES: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg":  "jpg",
      "image/png":  "png",
      "image/webp": "webp",
      "image/gif":  "gif",
    }
    const ext = VALID_TYPES[file.type]
    if (!ext) {
      return { ok: false, error: "Invalid file type. Please upload a JPG, PNG, WebP, or GIF image." }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: "File too large. Maximum size is 5MB." }
    }

    const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const { error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file, { contentType: file.type, cacheControl: "3600", upsert: false })

    if (error) {
      if (error.message.includes("bucket") && error.message.includes("not found")) {
        return { ok: false, error: "Storage bucket 'event-images' not found. Create it in Supabase Storage." }
      }
      return { ok: false, error: error.message }
    }

    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName)

    return { ok: true, url: urlData.publicUrl }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to upload image." }
  }
}
