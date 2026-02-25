import path from "path"
import fs from "fs/promises"
import { getServiceSupabase } from "@/lib/supabase"

export interface AdminConfig {
  fonts: {
    heading: string | null
    body: string | null
    button: string | null
    headingBold: boolean
    bodyBold: boolean
    buttonBold: boolean
  }
  images: {
    logo: string | null
    heroPoster: string | null
    /** Public URL of the hero section background video uploaded via the admin panel. */
    heroVideo: string | null
  }
}

const DEFAULT_CONFIG: AdminConfig = {
  fonts: { heading: null, body: null, button: null, headingBold: false, bodyBold: false, buttonBold: false },
  images: { logo: null, heroPoster: null, heroVideo: null },
}

// /tmp fallback for local dev without Supabase env vars
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
    fonts: { ...DEFAULT_CONFIG.fonts, ...parsed.fonts },
    images: { ...DEFAULT_CONFIG.images, ...parsed.images },
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

  // Fallback: /tmp file (local dev)
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

  // Fallback: /tmp file (local dev)
  await fs.mkdir(path.dirname(TMP_CONFIG_PATH), { recursive: true })
  await fs.writeFile(TMP_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
}
