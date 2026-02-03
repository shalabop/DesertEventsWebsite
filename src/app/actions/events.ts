"use server"

import { getServerSupabase } from "@/lib/supabase"

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
}

// Simple admin password check - in production use proper auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "desertevent2024"

export async function verifyAdminPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function getEvents() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching events:", error)
      // Return empty array instead of error - table might not exist yet
      return { ok: true, data: [] }
    }

    return { ok: true, data: data || [] }
  } catch (err) {
    console.error("Error in getEvents:", err)
    // Return empty array - database might not be configured
    return { ok: true, data: [] }
  }
}

export async function createEvent(event: EventData, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  try {
    const supabase = getServerSupabase()

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
        ticket_link: event.ticket_link || "#"
      }])
      .select()
      .single()

    if (error) {
      console.error("Error creating event:", error)
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return { ok: false, error: "Database table not set up. Please create the 'events' table in Supabase first." }
      }
      return { ok: false, error: error.message }
    }

    return { ok: true, data }
  } catch (err: any) {
    console.error("Error in createEvent:", err)
    return { ok: false, error: err?.message || "Failed to create event. Check your Supabase configuration." }
  }
}

export async function updateEvent(id: string, event: Partial<EventData>, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  try {
    const supabase = getServerSupabase()
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
        ticket_link: event.ticket_link
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating event:", error)
      return { ok: false, error: error.message }
    }

    return { ok: true, data }
  } catch (err: any) {
    console.error("Error in updateEvent:", err)
    return { ok: false, error: err?.message || "Failed to update event" }
  }
}

export async function deleteEvent(id: string, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  try {
    const supabase = getServerSupabase()
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting event:", error)
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (err: any) {
    console.error("Error in deleteEvent:", err)
    return { ok: false, error: err?.message || "Failed to delete event" }
  }
}

export async function uploadEventImage(formData: FormData, password: string) {
  if (!await verifyAdminPassword(password)) {
    return { ok: false, error: "Invalid admin password" }
  }

  try {
    const file = formData.get("file") as File
    if (!file) {
      return { ok: false, error: "No file provided" }
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return { ok: false, error: "Invalid file type. Please upload a JPG, PNG, WebP, or GIF image." }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: "File too large. Maximum size is 5MB." }
    }

    const supabase = getServerSupabase()

    // Generate unique filename
    const ext = file.name.split(".").pop()
    const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      })

    if (error) {
      console.error("Error uploading image:", error)
      if (error.message.includes("bucket") && error.message.includes("not found")) {
        return { ok: false, error: "Storage bucket not set up. Please create an 'event-images' bucket in Supabase Storage." }
      }
      return { ok: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName)

    return { ok: true, url: urlData.publicUrl }
  } catch (err: any) {
    console.error("Error in uploadEventImage:", err)
    return { ok: false, error: err?.message || "Failed to upload image" }
  }
}
