"use client"

import Image from "next/image"
import Link from "next/link"
import { submitCrawlHost } from "@/app/actions/forms"
import { useState } from "react"

export default function LeTourClient() {
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    const formData = new FormData(e.currentTarget)
    const res = await submitCrawlHost(formData)
    if (res.ok) {
      setStatus("success")
      e.currentTarget.reset()
    } else {
      setStatus("idle")
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
      {/* HERO */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero.jpg" alt="" fill className="object-cover" priority />
          <div className="ff-vignette" />
        </div>
        <div className="relative z-10 px-4 md:px-8 pt-12 pb-16 md:pt-24 md:pb-28 max-w-screen-xl mx-auto">
          <p className="ff-eyebrow text-xs md:text-sm">Le Tour De Crawl</p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl leading-[1.1] max-w-4xl mt-2">
            Bar Crawls That Bring the Country Together.
          </h1>
          <p className="text-[#C4C4C4] max-w-2xl mt-3 text-sm md:text-base">
            Nationally recognized themed bar crawls across 25+ cities.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/upcoming-events?filter=le-tour-de-crawl" className="ff-cta text-sm md:text-base">
              View Upcoming Crawls
            </Link>
            <a href="#host" className="ff-cta bg-transparent border border-white/20 text-white hover:bg-white/10 text-sm md:text-base">
              Host a Crawl
            </a>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-xl md:text-2xl">Upcoming Crawls</h2>
          <Link href="/upcoming-events?filter=le-tour-de-crawl" className="ff-link text-sm">
            View All Events →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1,2,3,4].map(i => (
            <article key={i} className="group">
              <div className="relative h-[180px] md:h-[220px] overflow-hidden rounded-2xl">
                <Image src={`/gallery/${(i % 6) + 1}.jpg`} alt="" fill className="ff-img transition-transform group-hover:scale-105" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="font-display text-base md:text-xl">City {i}</h3>
                <Link href="/upcoming-events?filter=le-tour-de-crawl" className="ff-link text-xs md:text-sm">Tickets →</Link>
              </div>
              <p className="text-xs md:text-sm text-[#C4C4C4] mt-1">Date • Venue • Theme</p>
            </article>
          ))}
        </div>
      </section>

      {/* MINI FORM */}
      <section id="host" className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="ff-eyebrow text-xs">Host a Crawl</p>
              <h2 className="font-display text-xl md:text-3xl mt-2">Bring Le Tour De Crawl to your city.</h2>
              <p className="text-[#C4C4C4] mt-3 text-sm md:text-base">Tell us your city, venues, and ideal dates. Our team will reach out to discuss partnership opportunities.</p>
            </div>

            {status === "success" ? (
              <div className="bg-[#32F36A]/10 border border-[#32F36A] rounded-xl p-6 text-center">
                <div className="text-[#32F36A] font-display text-xl mb-2">Thanks!</div>
                <p className="text-[#C4C4C4] text-sm">We'll reach out within 48 hours to discuss bringing Le Tour De Crawl to your city.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
                <input
                  name="name"
                  required
                  className="col-span-2 rounded-xl bg-[#1A1A1A] border border-white/10 px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm"
                  placeholder="Your name"
                />
                <input
                  name="email"
                  type="email"
                  required
                  className="col-span-2 sm:col-span-1 rounded-xl bg-[#1A1A1A] border border-white/10 px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm"
                  placeholder="Email"
                />
                <input
                  name="city"
                  required
                  className="col-span-2 sm:col-span-1 rounded-xl bg-[#1A1A1A] border border-white/10 px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm"
                  placeholder="City"
                />
                <textarea
                  name="notes"
                  rows={3}
                  className="col-span-2 rounded-xl bg-[#1A1A1A] border border-white/10 px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm resize-none"
                  placeholder="Venues / dates / notes"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="ff-cta col-span-2 sm:col-span-1 text-sm disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
