"use client"

import Image from "next/image"
import Link from "next/link"

export default function LeTourClient() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* HERO */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero.jpg" alt="" fill className="object-cover" priority />
          <div className="ff-vignette" />
        </div>
        <div className="relative z-10 px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 max-w-screen-xl mx-auto">
          <p className="ff-eyebrow">Le Tour De Crawl</p>
          <h1 className="font-display text-3xl md:text-5xl leading-[1.05] max-w-4xl">
            Bar Crawls That Bring the Country Together.
          </h1>
          <p className="text-[#C4C4C4] max-w-2xl mt-3">
            Nationally recognized themed bar crawls across 25+ cities.
          </p>
          <div className="mt-6">
            <a href="#host" className="ff-cta">Host a Crawl in Your City</a>
          </div>
        </div>
      </section>

      {/* UPCOMING (placeholders) */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid">
          {[1,2,3,4].map(i => (
            <article key={i} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div className="relative h-[220px] overflow-hidden rounded-2xl">
                <Image src={`/gallery/${(i % 6) + 1}.jpg`} alt="" fill className="ff-img" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="font-display text-lg md:text-xl">City {i}</h3>
                <Link href="#" className="ff-link text-sm">Tickets →</Link>
              </div>
              <p className="text-sm text-[#C4C4C4] mt-1">Date • Venue • Theme</p>
            </article>
          ))}
        </div>
      </section>

      {/* MINI FORM */}
      <section id="host" className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid items-center">
          <div className="col-span-12 md:col-span-6">
            <p className="ff-eyebrow">Host a Crawl</p>
            <h2 className="font-display text-2xl md:text-3xl mt-2">Bring Le Tour De Crawl to your city.</h2>
            <p className="text-[#C4C4C4] mt-2">Tell us your city, venues, and ideal dates. Our team will reach out.</p>
          </div>
          <form
            onSubmit={(e)=>{ e.preventDefault(); alert("Thanks! We’ll reach out."); }}
            className="col-span-12 md:col-span-6 mt-4 md:mt-0 grid grid-cols-2 gap-3"
          >
            <input className="col-span-2 rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="Your name" />
            <input className="col-span-2 md:col-span-1 rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="Email" />
            <input className="col-span-2 md:col-span-1 rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="City" />
            <textarea rows={4} className="col-span-2 rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="Venues / dates / notes" />
            <button className="ff-cta col-span-2 md:col-span-1">Send</button>
          </form>
        </div>
      </section>
    </div>
  )
}