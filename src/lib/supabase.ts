import { createClient } from "@supabase/supabase-js"

export function getServerSupabase() {
  const url = process.env.SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
}

// Uses service role key - bypasses RLS for admin operations
// Returns null if not configured so callers can return a clean error
export function getAdminSupabase() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}
