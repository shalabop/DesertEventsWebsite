"use client"

import Image from "next/image"
import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type EventType = "all" | "le-tour-de-crawl" | "society-sessions" | "scottsdale-guestlist" | "other"

interface Event {
  id: string
  title: string
  date: string
  time: string
  venue: string
  city: string
  type: EventType
  image: string
  description: string
  ticket_link?: string
  hover_video?: string | null
}

const fallbackEvents: Event[] = [
  {
    id: "bc-1",
    title: "Ugly Sweater Crawl",
    date: "2026-12-14",
    time: "4:00 PM - 11:00 PM",
    venue: "Downtown District",
    city: "Scottsdale",
    type: "le-tour-de-crawl",
    image: "/gallery/1.jpg",
    description: "Get festive with our annual ugly sweater bar crawl!",
    ticket_link: "#",
  },
  {
    id: "bc-2",
    title: "St. Patrick's Day Crawl",
    date: "2026-03-17",
    time: "2:00 PM - 10:00 PM",
    venue: "Old Town",
    city: "Scottsdale",
    type: "le-tour-de-crawl",
    image: "/gallery/2.jpg",
    description: "The biggest St. Paddy's celebration in Arizona!",
    ticket_link: "#",
  },
  {
    id: "ss-1",
    title: "Rooftop Sunset Session",
    date: "2026-02-15",
    time: "4:00 PM - 9:00 PM",
    venue: "Canopy Hotel",
    city: "Scottsdale",
    type: "society-sessions",
    image: "/gallery/5.jpg",
    description: "House music with stunning sunset views.",
    ticket_link: "#",
  },
  {
    id: "ss-2",
    title: "Coffee & Beats",
    date: "2026-02-22",
    time: "10:00 AM - 2:00 PM",
    venue: "Provision Coffee Bar",
    city: "Scottsdale",
    type: "society-sessions",
    image: "/gallery/6.jpg",
    description: "Morning vibes with specialty coffee and deep house.",
    ticket_link: "#",
  },
  {
    id: "sg-1",
    title: "VIP Friday at Riot House",
    date: "2026-02-14",
    time: "10:00 PM - 2:00 AM",
    venue: "Riot House",
    city: "Scottsdale",
    type: "scottsdale-guestlist",
    image: "/gallery/3.jpg",
    description: "Priority entry and exclusive VIP tables.",
    ticket_link: "/scottsdale-guestlist",
  },
  {
    id: "sg-2",
    title: "Latin Night at El Hefe",
    date: "2026-02-21",
    time: "9:00 PM - 2:00 AM",
    venue: "El Hefe",
    city: "Scottsdale",
    type: "scottsdale-guestlist",
    image: "/gallery/4.jpg",
    description: "Reggaeton and Latin hits all night.",
    ticket_link: "/scottsdale-guestlist",
  },
  {
    id: "other-1",
    title: "Charity Gala Night",
    date: "2026-03-15",
    time: "7:00 PM - 11:00 PM",
    venue: "Arizona Biltmore",
    city: "Phoenix",
    type: "other",
    image: "/gallery/6.jpg",
    description: "Annual charity gala supporting local causes.",
    ticket_link: "#",
  },
]

const filterOptions = [
  { value: "all" as EventType, label: "All Events" },
  { value: "le-tour-de-crawl" as EventType, label: "Bar Crawling" },
  { value: "society-sessions" as EventType, label: "Society Sessions" },
  { value: "scottsdale-guestlist" as EventType, label: "Scottsdale Guestlist" },
  { value: "other" as EventType, label: "Other" },
]

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00")
}

function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr)
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase()
}

function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case "le-tour-de-crawl": return "Bar Crawling"
    case "society-sessions": return "Society Sessions"
    case "scottsdale-guestlist": return "Scottsdale Guestlist"
    case "other": return "Other"
    default: return ""
  }
}

function getEventTypeColor(type: EventType): string {
  switch (type) {
    case "le-tour-de-crawl": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "society-sessions": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "scottsdale-guestlist": return "bg-[#32F36A]/20 text-[#32F36A] border-[#32F36A]/30"
    case "other": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default: return "bg-white/10 text-white border-white/20"
  }
}

// ─── Carousel ────────────────────────────────────────────────────────────────

function EventCarousel({ events }: { events: Event[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const CARD_WIDTH = 320 // px — matches the min-w class below
  const GAP = 24

  const updateButtons = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateButtons()
    el.addEventListener("scroll", updateButtons, { passive: true })
    return () => el.removeEventListener("scroll", updateButtons)
  }, [updateButtons, events])

  function scroll(direction: "prev" | "next") {
    const el = trackRef.current
    if (!el) return
    const step = CARD_WIDTH + GAP
    el.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" })
  }

  if (events.length === 0) {
    return (
      <p className="text-center text-[#888] py-12">No events found for this filter.</p>
    )
  }

  return (
    <div className="relative">
      {/* Scroll track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
        aria-label="Events carousel"
      >
        {events.map((event, index) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.4) }}
            className="flex-none w-[min(320px,85vw)] snap-start bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#32F36A]/50 transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getEventTypeColor(event.type)}`}>
                {getEventTypeLabel(event.type)}
              </div>
            </div>

            {/* Details */}
            <div className="p-5">
              <div className="text-[#32F36A] font-mono text-xs mb-2">
                {formatDate(event.date)} · {event.time}
              </div>
              <h3 className="font-display text-lg text-white mb-1 group-hover:text-[#32F36A] transition-colors line-clamp-1">
                {event.title}
              </h3>
              <p className="text-[#888] text-xs mb-3">{event.venue} · {event.city}</p>
              <p className="text-[#666] text-xs mb-4 line-clamp-2">{event.description}</p>
              <a
                href={event.ticket_link || "#"}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#32F36A] transition-colors"
              >
                {event.type === "scottsdale-guestlist" ? "Join Guestlist" : "Get Tickets"}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => scroll("prev")}
        disabled={!canPrev}
        aria-label="Previous events"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-all disabled:opacity-0 shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll("next")}
        disabled={!canNext}
        aria-label="Next events"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-all disabled:opacity-0 shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UpcomingEventsContent() {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get("filter") as EventType | null
  const [activeFilter, setActiveFilter] = useState<EventType>("all")
  const [events, setEvents] = useState<Event[]>(fallbackEvents)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data.events) && data.events.length > 0) {
            setEvents(data.events)
          } else if (data.error) {
            setFetchError(data.error)
          }
        }
      } catch {
        // Network error — fallback events stay in place.
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (filterParam && ["le-tour-de-crawl", "society-sessions", "scottsdale-guestlist", "other"].includes(filterParam)) {
      setActiveFilter(filterParam)
    }
  }, [filterParam])

  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
    )
    if (activeFilter === "all") return sorted
    return sorted.filter((e) => e.type === activeFilter)
  }, [activeFilter, events])

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden min-h-[40vh] md:min-h-[50vh] flex items-center px-4 md:px-8">
        <Image
          src="/gallery/3.jpg"
          alt="Upcoming Events"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
        <div className="relative z-10 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#32F36A] uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4"
          >
            Desert Events Calendar
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl lg:text-7xl mb-3 md:mb-4 text-white"
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-[#C4C4C4]"
          >
            Discover bar crawls, rooftop sessions, VIP nights, and exclusive experiences across Arizona.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                activeFilter === option.value
                  ? "bg-[#32F36A] text-black"
                  : "bg-[#1A1A1A] text-[#C4C4C4] border border-white/10 hover:border-[#32F36A]/50 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* Diagnostic — only visible if Supabase is misconfigured (non-fatal) */}
      {fetchError && (
        <section className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
            ℹ️ Could not load events from database ({fetchError}). Showing sample events.
          </div>
        </section>
      )}

      {/* Carousel */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-10">
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-[min(320px,85vw)] bg-[#111] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-5 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <EventCarousel events={filteredEvents} />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-[#32F36A]/10 to-[#32F36A]/5 border border-[#32F36A]/20 rounded-2xl p-6 md:p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-3 md:mb-4 text-white">
            Want to Host an Event?
          </h2>
          <p className="text-[#C4C4C4] mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Whether it&apos;s a bar crawl, rooftop session, or private party, we can help bring your vision to life.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#32F36A] text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-white transition-colors text-sm md:text-base"
          >
            Get in Touch
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
