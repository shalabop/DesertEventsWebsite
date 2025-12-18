"use server"

import { z } from "zod"
import { Resend } from "resend"
import { getServerSupabase } from "@/lib/supabase"

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  venue: z.string().min(1),
  date: z.string().min(1),
  party_size: z.number().int().positive(),
  intent: z.enum(["guestlist","table"]),
  budget_range: z.string().optional().default(""),
  arrival_window: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  source_page: z.string().optional().default(""),
})

export type LeadInput = z.infer<typeof schema>

export async function submitLead(payload: LeadInput) {
  try {
    const data = schema.parse(payload)

    // 1) Save to Supabase
    const sb = getServerSupabase()
    const { error } = await sb.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      venue: data.venue,
      date: data.date,
      party_size: data.party_size,
      intent: data.intent,
      budget_range: data.budget_range,
      arrival_window: data.arrival_window,
      notes: data.notes,
      source_page: data.source_page || "scottsdale-guestlist",
      status: "new",
    })
    if (error) throw error

    // 2) Email concierge
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO = "bookings@deserteventsaz.com"

    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY)
      await resend.emails.send({
        from: "Desert Events <no-reply@mail.deserteventsaz.com>",
        to: [TO],
        subject: `New ${data.intent.toUpperCase()} lead — ${data.name} (${data.venue})`,
        text: [
          `Name: ${data.name}`,
          `Phone: ${data.phone}`,
          `Email: ${data.email}`,
          `Venue: ${data.venue}`,
          `Date: ${data.date}`,
          `Party size: ${data.party_size}`,
          `Intent: ${data.intent}`,
          `Budget: ${data.budget_range}`,
          `Arrival: ${data.arrival_window}`,
          `Notes: ${data.notes}`,
          `Source: ${data.source_page}`,
        ].join("\n"),
      })
    } else {
      // Fallback: log to server console (visible in Vercel logs)
      console.log("[LEAD]", JSON.stringify(data))
    }

    return { ok: true }
  } catch (e:any) {
    console.error("submitLead error:", e?.message || e)
    return { ok: false, error: e?.message || "Failed to submit" }
  }
}
