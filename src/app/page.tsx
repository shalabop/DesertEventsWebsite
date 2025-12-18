"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const brands = [
  { title: "Scottsdale GuestList", href: "/scottsdale-guestlist", img: "/gallery/1.jpg", blurb: "Priority entry & VIP tables" },
  { title: "Le Tour De Crawl", href: "/le-tour-de-crawl", img: "/gallery/2.jpg", blurb: "National bar crawls" },
  { title: "Society Sessions", href: "/society-sessions", img: "/gallery/3.jpg", blurb: "House-music community" },
  { title: "Tableworthy", href: "/tableworthy", img: "/gallery/4.jpg", blurb: "Influencer hospitality" },
  { title: "Featured Event", href: "/scottsdale-guestlist", img: "/gallery/5.jpg", blurb: "Next drop — don’t miss" },
  { title: "Aftermovie", href: "/scottsdale-guestlist", img: "/gallery/6.jpg", blurb: "Last night highlights" },
]

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* HERO — full-bleed media + big editorial headline */}
      <section className="relative rounded-2xl overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/hero.jpg">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="ff-vignette" />
        <div className="relative z-10 px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 max-w-screen-xl mx-auto">
          <p className="ff-eyebrow">Desert Events Arizona</p>
          <motion.h1
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.5}}
            className="font-display text-4xl md:text-6xl leading-[1.05] max-w-4xl"
          >
            Arizona’s Leading Nightlife & Event Collective
          </motion.h1>
          <motion.p
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.55, delay:.05}}
            className="text-[#C4C4C4] max-w-2xl mt-4"
          >
            Old Town’s top venues, curated crawls, and culture-first sessions. Built for speed, clarity, and strong conversions.
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.12}} className="mt-8 flex flex-wrap gap-3">
            <Link href="/scottsdale-guestlist" className="ff-cta">Explore Scottsdale GuestList</Link>
            <a href="#brands" className="ff-link">Discover Our Brands →</a>
          </motion.div>
        </div>
      </section>

      {/* ORIGIN STORY — split editorial block */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid items-start">
          <div className="col-span-12 md:col-span-5">
            <p className="ff-eyebrow">Origin Story</p>
            <h2 className="font-display text-2xl md:text-4xl leading-tight mt-2">
              We didn’t just want to throw parties — we wanted to build a culture.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 text-[#C4C4C4] mt-6 md:mt-0 md:pl-8">
            <p>
              What started as a campus movement became Arizona’s most recognized nightlife ecosystem.
              From VIP tables to national crawls, our mission is simple: memorable nights that run smoothly.
            </p>
            <p className="mt-4">
              Founders: GL, JD, JL, JM. Based in Scottsdale. Focused on craft, community, and seamless logistics.
            </p>
          </div>
        </div>
      </section>

      {/* MOSAIC — asymmetric, magazine-y grid */}
      <section id="brands" className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid">
          {brands.map((b, i) => (
            <article
              key={b.title}
              className={[
                "col-span-12 sm:col-span-6 lg:col-span-4",
                i % 5 === 0 ? "lg:col-span-8" : "",  // make some tiles wider for asymmetry
              ].join(" ")}
            >
              <Link href={b.href} className="block group">
                <div className="relative h-[260px] md:h-[360px] overflow-hidden rounded-2xl">
                  <Image src={b.img} alt={b.title} fill className="ff-img group-hover:scale-[1.02]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="font-display text-xl md:text-2xl">{b.title}</h3>
                  <span className="text-xs text-[#C4C4C4]">View</span>
                </div>
                <p className="text-sm text-[#C4C4C4] mt-1">{b.blurb}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* MARQUEE — social proof / taglines */}
      <section className="py-8 border-y border-white/10">
        <div className="ff-marquee">
          <div className="ff-marquee-track">
            {Array.from({length:12}).map((_,i) => (
              <span key={i} className="text-[#C4C4C4]">Arizona • Old Town • VIP Tables • Bar Crawls • House Music • Culture •</span>
            ))}
          </div>
          <div className="ff-marquee-track" aria-hidden="true">
            {Array.from({length:12}).map((_,i) => (
              <span key={i} className="text-[#C4C4C4]">Arizona • Old Town • VIP Tables • Bar Crawls • House Music • Culture •</span>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER (placeholder wiring; we’ll hook Supabase/Resend next) */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid items-center">
          <div className="col-span-12 md:col-span-6">
            <p className="ff-eyebrow">Newsletter</p>
            <h3 className="font-display text-2xl md:text-3xl mt-2">Be first to know.</h3>
            <p className="text-[#C4C4C4] mt-2">Guestlist drops, special events, and early RSVP windows.</p>
          </div>
          <form onSubmit={(e)=>e.preventDefault()} className="col-span-12 md:col-span-6 mt-4 md:mt-0 flex gap-2">
            <input className="w-full rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="your@email.com" />
            <button className="ff-cta">Join</button>
          </form>
        </div>
      </section>
    </div>
  )
}
