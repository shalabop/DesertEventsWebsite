"use client"

import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// Event types for filtering
type EventType = "all" | "le-tour-de-crawl" | "society-sessions" | "scottsdale-guestlist" | "other"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  venue: string
  city: string
  type: EventType
  image: string
  description: string
  ticketLink?: string
}

// Sample events data - this would come from a database in production
const eventsData: Event[] = [
  // Le Tour De Crawl events
  {
    id: "ltdc-1",
    title: "Ugly Sweater Crawl",
    date: new Date("2026-12-14"),
    time: "4:00 PM - 11:00 PM",
    venue: "Downtown District",
    city: "Scottsdale",
    type: "le-tour-de-crawl",
    image: "/gallery/1.jpg",
    description: "Get festive with our annual ugly sweater bar crawl!",
    ticketLink: "#"
  },
  {
    id: "ltdc-2",
    title: "St. Patrick's Day Crawl",
    date: new Date("2026-03-17"),
    time: "2:00 PM - 10:00 PM",
    venue: "Old Town",
    city: "Scottsdale",
    type: "le-tour-de-crawl",
    image: "/gallery/2.jpg",
    description: "The biggest St. Paddy's celebration in Arizona!",
    ticketLink: "#"
  },
  {
    id: "ltdc-3",
    title: "Summer Kickoff Crawl",
    date: new Date("2026-05-23"),
    time: "3:00 PM - 11:00 PM",
    venue: "Mill Avenue",
    city: "Tempe",
    type: "le-tour-de-crawl",
    image: "/gallery/3.jpg",
    description: "Start summer right with the ultimate bar crawl experience.",
    ticketLink: "#"
  },
  {
    id: "ltdc-4",
    title: "Halloween Costume Crawl",
    date: new Date("2026-10-31"),
    time: "6:00 PM - 2:00 AM",
    venue: "Downtown",
    city: "Phoenix",
    type: "le-tour-de-crawl",
    image: "/gallery/4.jpg",
    description: "Costumes required! Best costume wins prizes.",
    ticketLink: "#"
  },
  // Society Sessions events
  {
    id: "ss-1",
    title: "Rooftop Sunset Session",
    date: new Date("2026-02-15"),
    time: "4:00 PM - 9:00 PM",
    venue: "Canopy Hotel",
    city: "Scottsdale",
    type: "society-sessions",
    image: "/gallery/5.jpg",
    description: "House music with stunning sunset views.",
    ticketLink: "#"
  },
  {
    id: "ss-2",
    title: "Coffee & Beats",
    date: new Date("2026-02-22"),
    time: "10:00 AM - 2:00 PM",
    venue: "Provision Coffee Bar",
    city: "Scottsdale",
    type: "society-sessions",
    image: "/gallery/6.jpg",
    description: "Morning vibes with specialty coffee and deep house.",
    ticketLink: "#"
  },
  {
    id: "ss-3",
    title: "Pool Party Session",
    date: new Date("2026-04-12"),
    time: "12:00 PM - 6:00 PM",
    venue: "W Hotel",
    city: "Scottsdale",
    type: "society-sessions",
    image: "/gallery/1.jpg",
    description: "Poolside house music and summer vibes.",
    ticketLink: "#"
  },
  {
    id: "ss-4",
    title: "Desert Night Session",
    date: new Date("2026-03-08"),
    time: "8:00 PM - 1:00 AM",
    venue: "The Mint",
    city: "Phoenix",
    type: "society-sessions",
    image: "/gallery/2.jpg",
    description: "Late night house music experience.",
    ticketLink: "#"
  },
  // Scottsdale Guestlist events
  {
    id: "sg-1",
    title: "VIP Friday at Riot House",
    date: new Date("2026-02-14"),
    time: "10:00 PM - 2:00 AM",
    venue: "Riot House",
    city: "Scottsdale",
    type: "scottsdale-guestlist",
    image: "/gallery/3.jpg",
    description: "Priority entry and exclusive VIP tables.",
    ticketLink: "/scottsdale-guestlist"
  },
  {
    id: "sg-2",
    title: "Latin Night at El Hefe",
    date: new Date("2026-02-21"),
    time: "9:00 PM - 2:00 AM",
    venue: "El Hefe",
    city: "Scottsdale",
    type: "scottsdale-guestlist",
    image: "/gallery/4.jpg",
    description: "Reggaeton and Latin hits all night.",
    ticketLink: "/scottsdale-guestlist"
  },
  {
    id: "sg-3",
    title: "Saturday Night at Cake",
    date: new Date("2026-02-22"),
    time: "10:00 PM - 3:00 AM",
    venue: "Cake",
    city: "Scottsdale",
    type: "scottsdale-guestlist",
    image: "/gallery/5.jpg",
    description: "The ultimate Saturday night club experience.",
    ticketLink: "/scottsdale-guestlist"
  },
  // Other events
  {
    id: "other-1",
    title: "Charity Gala Night",
    date: new Date("2026-03-15"),
    time: "7:00 PM - 11:00 PM",
    venue: "Arizona Biltmore",
    city: "Phoenix",
    type: "other",
    image: "/gallery/6.jpg",
    description: "Annual charity gala supporting local causes.",
    ticketLink: "#"
  },
  {
    id: "other-2",
    title: "Wine Tasting Experience",
    date: new Date("2026-04-05"),
    time: "5:00 PM - 9:00 PM",
    venue: "Merkin Vineyards",
    city: "Cottonwood",
    type: "other",
    image: "/gallery/1.jpg",
    description: "Exclusive wine tasting with local vineyards.",
    ticketLink: "#"
  },
]

const filterOptions = [
  { value: "all" as EventType, label: "All Events" },
  { value: "le-tour-de-crawl" as EventType, label: "Le Tour De Crawl" },
  { value: "society-sessions" as EventType, label: "Society Sessions" },
  { value: "scottsdale-guestlist" as EventType, label: "Scottsdale Guestlist" },
  { value: "other" as EventType, label: "Other" },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).toUpperCase()
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  })
}

function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case "le-tour-de-crawl":
      return "Le Tour De Crawl"
    case "society-sessions":
      return "Society Sessions"
    case "scottsdale-guestlist":
      return "Scottsdale Guestlist"
    case "other":
      return "Other"
    default:
      return ""
  }
}

function getEventTypeColor(type: EventType): string {
  switch (type) {
    case "le-tour-de-crawl":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "society-sessions":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "scottsdale-guestlist":
      return "bg-[#32F36A]/20 text-[#32F36A] border-[#32F36A]/30"
    case "other":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default:
      return "bg-white/10 text-white border-white/20"
  }
}

export default function UpcomingEventsContent() {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get("filter") as EventType | null
  const [activeFilter, setActiveFilter] = useState<EventType>("all")

  // Set filter from URL query parameter on mount
  useEffect(() => {
    if (filterParam && ["le-tour-de-crawl", "society-sessions", "scottsdale-guestlist", "other"].includes(filterParam)) {
      setActiveFilter(filterParam)
    }
  }, [filterParam])

  const filteredEvents = useMemo(() => {
    const sorted = [...eventsData].sort((a, b) => a.date.getTime() - b.date.getTime())
    if (activeFilter === "all") return sorted
    return sorted.filter(event => event.type === activeFilter)
  }, [activeFilter])

  // Group events by month
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: Event[] } = {}
    filteredEvents.forEach(event => {
      const key = formatMonthYear(event.date)
      if (!groups[key]) groups[key] = []
      groups[key].push(event)
    })
    return groups
  }, [filteredEvents])

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Hero Section */}
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

      {/* Filter Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`
                px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                ${activeFilter === option.value
                  ? "bg-[#32F36A] text-black"
                  : "bg-[#1A1A1A] text-[#C4C4C4] border border-white/10 hover:border-[#32F36A]/50 hover:text-white"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events Calendar/List Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          {Object.keys(groupedEvents).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-[#888] text-lg">No events found for this filter.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10 md:space-y-12"
            >
              {Object.entries(groupedEvents).map(([monthYear, events]) => (
                <div key={monthYear}>
                  <h2 className="font-display text-xl md:text-2xl mb-4 md:mb-6 text-white border-b border-white/10 pb-3">
                    {monthYear}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {events.map((event, index) => (
                      <motion.article
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#32F36A]/50 transition-all duration-300"
                      >
                        {/* Event Image */}
                        <div className="relative h-40 md:h-48 overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                          {/* Event Type Badge */}
                          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 md:p-5">
                          {/* Date & Time */}
                          <div className="text-[#32F36A] font-mono text-xs md:text-sm mb-2">
                            {formatDate(event.date)} • {event.time}
                          </div>

                          {/* Title */}
                          <h3 className="font-display text-lg md:text-xl text-white mb-2 group-hover:text-[#32F36A] transition-colors">
                            {event.title}
                          </h3>

                          {/* Location */}
                          <p className="text-[#888] text-xs md:text-sm mb-3">
                            {event.venue} • {event.city}
                          </p>

                          {/* Description */}
                          <p className="text-[#666] text-xs md:text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          {/* CTA Button */}
                          <a
                            href={event.ticketLink}
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white hover:text-[#32F36A] transition-colors"
                          >
                            {event.type === "scottsdale-guestlist" ? "Join Guestlist" : "Get Tickets"}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-[#32F36A]/10 to-[#32F36A]/5 border border-[#32F36A]/20 rounded-2xl p-6 md:p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-3 md:mb-4 text-white">
            Want to Host an Event?
          </h2>
          <p className="text-[#C4C4C4] mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Whether it's a bar crawl, rooftop session, or private party, we can help bring your vision to life.
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
