"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/scottsdale-guestlist", label: "Scottsdale GuestList" },
  { href: "/le-tour-de-crawl", label: "Le Tour De Crawl" },
  { href: "/society-sessions", label: "Society Sessions" },
  { href: "/tableworthy", label: "Tableworthy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[#0B0B0B]/70">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Desert Events Home">
          <Image src="/de-badge.png" alt="Desert Events" width={120} height={32} priority />
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[#C4C4C4] hover:text-white transition relative",
                  active && "text-white after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-[#32F36A]"
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/scottsdale-guestlist#guestlist-form" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5">
            Join Guestlist
          </Link>
          <Link href="/scottsdale-guestlist#guestlist-form" className="px-5 py-3 rounded-xl bg-[#32F36A] text-black hover:opacity-90">
            Book Table
          </Link>
        </div>
      </div>
    </header>
  )
}
