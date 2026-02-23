import { NextResponse } from "next/server"

// Curated fallback list used when GOOGLE_FONTS_API_KEY is not set
const FALLBACK_FONTS = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway",
  "Poppins", "Merriweather", "Playfair Display", "Nunito", "Ubuntu",
  "PT Sans", "Noto Sans", "Source Sans 3", "Inter", "Josefin Sans",
  "Libre Baskerville", "DM Sans", "Space Grotesk", "Outfit",
  "Bebas Neue", "Cinzel", "Cormorant Garamond", "Crimson Text",
  "Dancing Script", "Exo 2", "Fjalla One", "Karla", "Manrope", "Mulish",
]

export async function GET() {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ fonts: FALLBACK_FONTS })
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
      { next: { revalidate: 86400 } }
    )

    if (!res.ok) {
      return NextResponse.json({ fonts: FALLBACK_FONTS })
    }

    const data = await res.json()
    const fonts: string[] = (data.items ?? []).map((item: { family: string }) => item.family)

    return NextResponse.json({ fonts })
  } catch {
    return NextResponse.json({ fonts: FALLBACK_FONTS })
  }
}
