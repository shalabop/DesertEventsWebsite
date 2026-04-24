import Image from "next/image"
import Link from "next/link"
import { getAdminConfig } from "@/lib/admin-config"
import { HeroSection } from "@/components/hero-section"

// Strictly the 4 main brands
const brands = [
  { title: "Scottsdale GuestList", href: "/scottsdale-guestlist", img: "/gallery/GuestListGL.png", blurb: "Priority entry & VIP tables" },
  { title: "Bar Crawling", href: "/upcoming-events?filter=le-tour-de-crawl", img: "/gallery/BarCrawling2.png", blurb: "National bar crawls" },
  { title: "Society Sessions", href: "/upcoming-events?filter=society-sessions", img: "/gallery/3.jpg", blurb: "House-music community" },
  { title: "Tableworthy", href: "/tableworthy", img: "/gallery/TW.png", blurb: "Influencer hospitality" },
]

export default async function HomePage() {
  // Read admin config on the server so the hero video URL comes from the database
  // rather than being hardcoded to /hero.mp4.
  const config = await getAdminConfig()
  const heroVideoSrc  = config.images.heroVideo  ?? "/hero.mp4"
  const heroPosterSrc = config.images.heroPoster ?? "/de-badge.png"

  return (
    <div className="space-y-24 md:space-y-32">
      {/* HERO — video/poster URLs come from admin config */}
      <HeroSection videoSrc={heroVideoSrc} posterSrc={heroPosterSrc} />

      {/* ORIGIN STORY (Parallax style) */}
      <section className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
           <p className="text-[#C4C4C4] text-lg leading-relaxed">
             &ldquo;We didn&apos;t just want to throw parties — we wanted to build a culture.&rdquo;
           </p>
           <p className="mt-4 text-white font-display text-2xl">
             Founders: GL, JD, JL, JM
           </p>
        </div>
        <div className="text-[#666] text-sm md:text-base leading-relaxed">
          What started as a campus movement became Arizona&apos;s most recognized nightlife ecosystem.
          From VIP tables to national crawls, our mission is simple: memorable nights that run smoothly.
        </div>
      </section>

      {/* BRANDS GRID */}
      <section id="brands" className="max-w-screen-xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl mb-10">Our Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brands.map((b) => (
            <Link key={b.title} href={b.href} className="group relative block overflow-hidden rounded-3xl">
              <div className="relative h-[400px]">
                <Image src={b.img} alt={b.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-3xl text-white mb-1">{b.title}</h3>
                  <p className="text-[#C4C4C4]">{b.blurb}</p>
                </div>
                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="max-w-screen-xl mx-auto px-6 pb-20">
         <div className="flex justify-between items-end mb-10">
            <h2 className="font-display text-3xl md:text-4xl">Featured Events</h2>
            <Link href="/upcoming-events" className="text-[#32F36A] hover:text-white transition-colors">View All →</Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-4 hover:border-[#32F36A]/50 transition-colors cursor-pointer">
                <div className="h-48 bg-[#1a1a1a] rounded-xl mb-4 relative overflow-hidden">
                   {/* Placeholder for event image */}
                   <Image src={`/gallery/${i+2}.jpg`} alt="" fill className="object-cover opacity-60" />
                </div>
                <div className="text-[#32F36A] text-xs font-mono mb-2">NOV {10 + i} • 9:00 PM</div>
                <h3 className="text-xl font-display mb-1">Desert Nights Vol. {i}</h3>
                <p className="text-sm text-[#888]">Riot House • Scottsdale</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  )
}
