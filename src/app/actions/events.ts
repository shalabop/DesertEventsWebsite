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
      return { ok: false, error: error.message, data: [] }
    }

    return { ok: true, data: data || [] }
  } catch (err) {
    console.error("Error in getEvents:", err)
    return { ok: false, error: "Failed to fetch events", data: [] }
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
      return { ok: false, error: error.message }
    }

    return { ok: true, data }
  } catch (err) {
    console.error("Error in createEvent:", err)
    return { ok: false, error: "Failed to create event" }
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
  } catch (err) {
    console.error("Error in updateEvent:", err)
    return { ok: false, error: "Failed to update event" }
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
  } catch (err) {
    console.error("Error in deleteEvent:", err)
    return { ok: false, error: "Failed to delete event" }
  }
}
