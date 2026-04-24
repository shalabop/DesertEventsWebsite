/** Shared types and defaults — no Node.js imports, safe to use in client components. */

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
    heroVideo: string | null
    nightlifeLogo: string | null
    nightlifeHeroPoster: string | null
    nightlifeHeroVideo: string | null
  }
  venues: VenueConfig[]
  nightlife: {
    heading: string
    subheading: string
  }
  instagram: {
    enabled: boolean
    heading: string
    postsCount: number
    fallbackPosts: InstagramPost[]
  }
}

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
  venues: [
    { name: "Riot House", vibe: "EDM/hip-hop, high energy", img: "/venues/riot-house.jpg", hoverVideo: null },
    { name: "El Hefe", vibe: "Latin + party crowd", img: "/venues/el-hefe.jpg", hoverVideo: null },
    { name: "Cake", vibe: "Nightclub atmosphere, VIP tables", img: "/venues/cake.jpg", hoverVideo: null },
    { name: "Whiskey Row", vibe: "Country crossover", img: "/venues/whiskey-row.jpg", hoverVideo: null },
    { name: "Maya", vibe: "Upscale lounge, bottle service", img: "/gallery/3.jpg", hoverVideo: null },
  ],
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
