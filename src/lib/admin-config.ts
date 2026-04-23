/** Server-only module — uses fs and Supabase. Do not import in client components. */
import path from "path"
import fs from "fs/promises"
import { getServiceSupabase } from "@/lib/supabase"

export type { VenueConfig, InstagramPost, AdminConfig } from "@/lib/admin-config-defaults"
export { DEFAULT_CONFIG } from "@/lib/admin-config-defaults"

import type { AdminConfig } from "@/lib/admin-config-defaults"
import { DEFAULT_CONFIG } from "@/lib/admin-config-defaults"

const TMP_CONFIG_PATH = path.join("/tmp", "admin-config.json")

function tryGetServiceSupabase() {
  try {
    return getServiceSupabase()
  } catch {
    return null
  }
}

function mergeWithDefaults(parsed: Partial<AdminConfig>): AdminConfig {
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    fonts: { ...DEFAULT_CONFIG.fonts, ...parsed.fonts },
    images: { ...DEFAULT_CONFIG.images, ...parsed.images },
    venues: Array.isArray(parsed.venues) && parsed.venues.length > 0
      ? parsed.venues
      : DEFAULT_CONFIG.venues,
    nightlife: { ...DEFAULT_CONFIG.nightlife, ...parsed.nightlife },
    instagram: { ...DEFAULT_CONFIG.instagram, ...parsed.instagram },
  }
}

export async function getAdminConfig(): Promise<AdminConfig> {
  const supabase = tryGetServiceSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admin_config")
        .select("config")
        .eq("id", 1)
        .single()
      if (!error && data) return mergeWithDefaults(data.config as Partial<AdminConfig>)
    } catch { /* fall through to /tmp */ }
  }

  try {
    const raw = await fs.readFile(TMP_CONFIG_PATH, "utf-8")
    return mergeWithDefaults(JSON.parse(raw) as Partial<AdminConfig>)
  } catch {
    return DEFAULT_CONFIG
  }
}

export async function setAdminConfig(config: AdminConfig): Promise<void> {
  const supabase = tryGetServiceSupabase()
  if (supabase) {
    const { error } = await supabase
      .from("admin_config")
      .upsert({ id: 1, config })
    if (!error) return
    throw new Error(error.message)
  }

  await fs.mkdir(path.dirname(TMP_CONFIG_PATH), { recursive: true })
  await fs.writeFile(TMP_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
}
