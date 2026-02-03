"use client"
import Image from "next/image"
import Link from "next/link"
import { submitLead } from "@/app/actions/submitLead"
import { useState } from "react"

export default function SocietySessionsPage() {
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    const res = await submitLead({
      name,
      email,
      phone: "0000000000",
      venue: "Society",
      date: "N/A",
      party_size: 1,
      intent: "guestlist",
      source_page: "society-sessions",
      budget_range: "",
      arrival_window: "",
      notes: ""
    })

    if (res.ok) {
      setStatus("success")
      e.currentTarget.reset()
    } else {
      setStatus("idle")
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="space-y-10 md:space-y-20 pb-20">
      {/* HERO */}
      <section className="relative rounded-2xl overflow-hidden min-h-[40vh] md:min-h-[50vh] flex items-center px-4 md:px-8">
        <Image src="/gallery/3.jpg" alt="Society Sessions" fill className="object-cover brightness-[0.4]" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-[#32F36A] uppercase tracking-widest text-xs md:text-sm mb-2 md:mb-4">Society Sessions</p>
          <h1 className="font-display text-3xl md:text-5xl lg:text-7xl mb-3 md:mb-4 text-white">House Music & Community</h1>
          <p className="text-base md:text-xl text-[#C4C4C4]">Exclusive rooftop and coffeehouse sessions centered around house music and community.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/upcoming-events?filter=society-sessions" className="ff-cta text-sm md:text-base">
              View Upcoming Sessions
            </Link>
            <a href="#community" className="ff-cta bg-transparent border border-white/20 text-white hover:bg-white/10 text-sm md:text-base">
              Join Community
            </a>
          </div>
        </div>
      </section>

      {/* UPCOMING SESSIONS PREVIEW */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-xl md:text-3xl text-white">Upcoming Sessions</h2>
          <Link href="/upcoming-events?filter=society-sessions" className="text-[#32F36A] hover:text-white transition-colors text-sm">
            View All Sessions →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href="/upcoming-events?filter=society-sessions"
              className="flex gap-4 p-4 border border-white/10 rounded-xl bg-[#111] hover:border-[#32F36A]/50 transition-colors group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-lg relative overflow-hidden flex-shrink-0">
                <Image src={`/gallery/${i}.jpg`} fill className="object-cover" alt="" />
              </div>
              <div className="min-w-0">
                <div className="text-[#32F36A] font-mono text-xs md:text-sm">SUN, FEB {10+i}</div>
                <h3 className="font-display text-lg md:text-xl text-white group-hover:text-[#32F36A] transition-colors truncate">Rooftop Sunset</h3>
                <p className="text-[#888] text-xs md:text-sm">Canopy Hotel • 4pm - 9pm</p>
                <span className="text-xs md:text-sm underline mt-2 text-white inline-block">RSVP →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHAT IS SOCIETY SESSIONS */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="ff-eyebrow text-xs mb-2">The Vibe</p>
            <h2 className="font-display text-2xl md:text-4xl text-white mb-4">More Than Just Music</h2>
            <p className="text-[#C4C4C4] leading-relaxed text-sm md:text-base">
              Society Sessions is a community-first experience. We curate intimate gatherings at rooftops, coffeehouses, and unique venues where house music enthusiasts can connect, dance, and enjoy quality sound in beautiful settings.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Curated house music from local DJs",
                "Intimate rooftop & venue settings",
                "Community-focused atmosphere",
                "Day parties & sunset sessions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm md:text-base">
                  <span className="w-2 h-2 rounded-full bg-[#32F36A]" />
                  <span className="text-[#C4C4C4]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image src="/gallery/5.jpg" alt="Society Sessions vibe" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* COMMUNITY FORM */}
      <section id="community" className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="font-display text-2xl md:text-3xl mb-4 text-white">Join The Community</h2>
            <p className="text-[#888] text-sm md:text-base">Get invited to private sessions, early access to tickets, and exclusive updates from the Society Sessions community.</p>
          </div>

          <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="text-[#32F36A] font-display text-xl mb-2">You're on the list!</div>
                <p className="text-[#C4C4C4] text-sm">We'll reach out with exclusive session invites.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  required
                  placeholder="Name"
                  className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#32F36A] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm md:text-base"
                >
                  {status === "loading" ? "Joining..." : "Join Guestlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
