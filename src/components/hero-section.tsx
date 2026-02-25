"use client"

import Link from "next/link"
import { motion } from "framer-motion"

/**
 * Client component for the homepage hero section.
 * Receives the hero video/poster URLs from the server so they come from the
 * admin config rather than being hardcoded to /hero.mp4.
 */
export function HeroSection({
  videoSrc,
  posterSrc,
}: {
  videoSrc: string
  posterSrc: string
}) {
  return (
    <section className="relative rounded-2xl overflow-hidden min-h-[85vh] flex items-center">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

      <div className="relative z-10 px-6 max-w-screen-xl mx-auto w-full pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#32F36A] font-medium tracking-wider mb-4 uppercase text-sm"
        >
          Desert Events Arizona
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1] max-w-4xl text-white mb-6"
        >
          Arizona's Leading <br /> Nightlife & Event <br /> Collective
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          <Link
            href="/scottsdale-guestlist"
            className="bg-[#32F36A] text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors"
          >
            Explore Scottsdale GuestList
          </Link>
          <Link
            href="#brands"
            className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
          >
            Discover Our Brands
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
