import path from "path"
import fs from "fs/promises"
import { getServiceSupabase } from "@/lib/supabase"

export interface VenueConfig {
  name: string
  vibe: string
  img: string
  hoverVideo?: string | null
}

export interface InstagramPost {
  url: string
  label?: string
}

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
    /** Public URL of the homepage hero background video. */
    heroVideo: string | null
    /** Logo shown on the Nightlife / Scottsdale Guestlist page. */
    nightlifeLogo: string | null
    /** Hero poster for the Nightlife page. */
    nightlifeHeroPoster: string | null
    /** Hero background video for the Nightlife page. */
    nightlifeHeroVideo: string | null
  }
  /** Ordered list of participating venues on the Nightlife page. */
  venues: VenueConfig[]
  nightlife: {
    heading: string
    subheading: string
  }
  instagram: {
    enabled: boolean
    heading: string
    postsCount: number
    /** Manual fallback posts shown when env vars are missing. */
    fallbackPosts: InstagramPost[]
  }
}

const DEFAULT_VENUES: VenueConfig[] = [
  { name: "Riot House", vibe: "EDM/hip-hop, high energy", img: "/venues/riot-house.jpg", hoverVideo: null },
  { name: "El Hefe", vibe: "Latin + party crowd", img: "/venues/el-hefe.jpg", hoverVideo: null },
  { name: "Cake", vibe: "Nightclub atmosphere, VIP tables", img: "/venues/cake.jpg", hoverVideo: null },
  { name: "Whiskey Row", vibe: "Country crossover", img: "/venues/whiskey-row.jpg", hoverVideo: null },
  { name: "Maya", vibe: "Upscale lounge, bottle service", img: "/venues/maya.jpg", hoverVideo: null },
]

export const DEFAULT_CONFIG: AdminConfig = {
  fonts: { heading: null, body: null, button: null, headingBold: false, bodyBold: false, buttonBold: false },
  images: {
    logo: null,
    heroPoster: null,
    heroVideo: null,
    nightlifeLogo: null,
    nightlifeHeroPoster: null,
    nightlifeHeroVideo: null,
  },
  venues: DEFAULT_VENUES,
  nightlife: {
    heading: "Nightlife",
    subheading: "Priority entry & bottle service at Old Town's top venues.",
  },
  instagram: {
    enabled: false,
    heading: "Follow the Party",
    postsCount: 9,
    fallbackPosts: [],
  },
}

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
