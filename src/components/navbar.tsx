"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/scottsdale-guestlist", label: "Scottsdale GuestList" },
  { href: "/upcoming-events", label: "Upcoming Events" },
  { href: "/tableworthy", label: "Tableworthy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const toggleMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[#0B0B0B]/90">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Desert Events Home">
            <Image src="/de-badge.png" alt="Desert Events" width={120} height={32} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {links.map((l) => {
              const active = pathname === l.href ||
                (l.href === "/upcoming-events" && (pathname === "/le-tour-de-crawl" || pathname === "/society-sessions"))
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

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/scottsdale-guestlist#guestlist-form" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm">
              Join Guestlist
            </Link>
            <Link href="/scottsdale-guestlist#guestlist-form" className="px-5 py-3 rounded-xl bg-[#32F36A] text-black hover:opacity-90 text-sm font-medium">
              Book Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden p-2 -mr-2 text-white focus:outline-none z-[60]"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        className={cn(
          "fixed top-16 right-0 bottom-0 w-full max-w-[300px] bg-[#0B0B0B] border-l border-white/10 z-[60] lg:hidden overflow-y-auto transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col p-6">
          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {links.map((l) => {
              const active = pathname === l.href ||
                (l.href === "/upcoming-events" && (pathname === "/le-tour-de-crawl" || pathname === "/society-sessions"))
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-lg transition-colors",
                    active
                      ? "bg-[#32F36A]/10 text-[#32F36A]"
                      : "text-[#C4C4C4] hover:bg-white/5 hover:text-white"
                  )}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile CTA Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              href="/scottsdale-guestlist#guestlist-form"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full px-5 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-center font-medium text-white"
            >
              Join Guestlist
            </Link>
            <Link
              href="/scottsdale-guestlist#guestlist-form"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full px-5 py-4 rounded-xl bg-[#32F36A] text-black hover:opacity-90 text-center font-bold"
            >
              Book Table
            </Link>
          </div>

          {/* Mobile Quick Links */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-[#666] uppercase tracking-wider mb-4">Quick Links</p>
            <div className="space-y-2">
              <Link
                href="/upcoming-events?filter=le-tour-de-crawl"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
              >
                Le Tour De Crawl Events
              </Link>
              <Link
                href="/upcoming-events?filter=society-sessions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
              >
                Society Sessions Events
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
