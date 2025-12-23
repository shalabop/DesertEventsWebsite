"use server"

import { z } from "zod"
import { getServerSupabase } from "@/lib/supabase"

// --- Newsletter ---
const newsletterSchema = z.object({ email: z.string().email() })

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string
  const parse = newsletterSchema.safeParse({ email })
  if (!parse.success) return { ok: false, error: "Invalid email" }

  const sb = getServerSupabase()
  const { error } = await sb.from("newsletter").upsert({ email }, { onConflict: "email" })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// --- Contact / Partnerships ---
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(1),
})

export async function submitContact(payload: any) {
  try {
    const data = contactSchema.parse(payload)
    const sb = getServerSupabase()
    const { error } = await sb.from("contacts").insert({
      name: data.name,
      email: data.email,
      company_brand: data.company,
      budget_range: data.budget,
      message: data.message
    })
    if (error) throw error
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message || "Failed" }
  }
}

// --- Tableworthy ---
export async function submitTableworthy(payload: any) {
  try {
    const sb = getServerSupabase()
    const { error } = await sb.from("tableworthy_leads").insert(payload)
    if (error) throw error
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

// --- Le Tour Host ---
export async function submitCrawlHost(payload: any) {
  try {
    const sb = getServerSupabase()
    const { error } = await sb.from("crawl_hosts").insert(payload)
    if (error) throw error
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}