/// <reference types="react" />
import React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  title: "Desert Events Arizona",
  description: "Arizona’s leading nightlife & event collective.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
        <Preloader />
        <Navbar />
        <main className="max-w-screen-xl mx-auto px-4 md:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
