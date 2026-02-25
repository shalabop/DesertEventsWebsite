/// <reference types="react" />
import React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"
import { getAdminConfig } from "@/lib/admin-config"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  title: "Desert Events Arizona",
  description: "Arizona's leading nightlife & event collective.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getAdminConfig()

  // Build Google Fonts <link> for any saved custom fonts
  const customFonts = [config.fonts.heading, config.fonts.body, config.fonts.button].filter(
    (f): f is string => typeof f === "string" && f.length > 0
  )
  const googleFontsHref =
    customFonts.length > 0
      ? `https://fonts.googleapis.com/css2?${customFonts
          .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
          .join("&")}&display=swap`
      : null

  // Build CSS variable override block (only for non-null/non-default values)
  const cssVarLines: string[] = []
  if (config.fonts.heading) {
    cssVarLines.push(`--font-heading: '${config.fonts.heading}', var(--font-space-grotesk), ui-sans-serif, system-ui;`)
  }
  if (config.fonts.body) {
    cssVarLines.push(`--font-body: '${config.fonts.body}', var(--font-inter), ui-sans-serif, system-ui;`)
  }
  if (config.fonts.button) {
    cssVarLines.push(`--font-button: '${config.fonts.button}', inherit;`)
  }
  if (config.fonts.headingBold) cssVarLines.push(`--font-weight-heading: 700;`)
  if (config.fonts.bodyBold) cssVarLines.push(`--font-weight-body: 700;`)
  if (config.fonts.buttonBold) cssVarLines.push(`--font-weight-button: 700;`)
  const cssVarOverrides =
    cssVarLines.length > 0 ? `:root { ${cssVarLines.join(" ")} }` : ""

  const logoSrc = config.images.logo ?? "/de-badge.png"

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {googleFontsHref && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsHref} />
          </>
        )}
        {cssVarOverrides && (
          <style dangerouslySetInnerHTML={{ __html: cssVarOverrides }} />
        )}
      </head>
      <body className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
        <Preloader logoSrc={logoSrc} />
        <Navbar logoSrc={logoSrc} />
        <main className="max-w-screen-xl mx-auto px-4 md:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
