"use client"
import { subscribeNewsletter } from "@/app/actions/forms"
import { useState } from "react"
import Link from "next/link"

export function Footer() {
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle")

  async function handleSubmit(formData: FormData) {
    setStatus("loading")
    const res = await subscribeNewsletter(formData)
    if (res.ok) setStatus("success")
    else setStatus("idle") // simplistic error handling
  }

  return (
    <footer className="border-t border-white/10 mt-16 bg-[#0B0B0B]">
      <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-12">
        {/* Mobile: Stack vertically, Desktop: 4-column grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
          {/* Brand Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="font-display text-lg">Desert Events Arizona</div>
            <p className="text-[#C4C4C4] mt-3 leading-relaxed">
              Arizona's leading nightlife & event collective. <br className="hidden sm:block"/>
              Creating culture in the desert.
            </p>
          </div>

          {/* Brands Links */}
          <div>
            <div className="font-semibold mb-3 text-white">Brands</div>
            <ul className="space-y-2 text-[#C4C4C4]">
              <li><Link className="hover:text-[#32F36A] transition-colors" href="/scottsdale-guestlist">Scottsdale GuestList</Link></li>
              <li><Link className="hover:text-[#32F36A] transition-colors" href="/upcoming-events?filter=le-tour-de-crawl">Le Tour De Crawl</Link></li>
              <li><Link className="hover:text-[#32F36A] transition-colors" href="/upcoming-events?filter=society-sessions">Society Sessions</Link></li>
              <li><Link className="hover:text-[#32F36A] transition-colors" href="/tableworthy">Tableworthy</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <div className="font-semibold mb-3 text-white">Social</div>
            <ul className="space-y-2 text-[#C4C4C4]">
              <li><a className="hover:text-[#32F36A] transition-colors" href="https://www.instagram.com/deserteventsarizona/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="hover:text-[#32F36A] transition-colors" href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a className="hover:text-[#32F36A] transition-colors" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a className="hover:text-[#32F36A] transition-colors" href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-1">
             <div className="font-semibold mb-3 text-white">Newsletter</div>
             {status === "success" ? (
               <div className="text-[#32F36A]">You're on the list.</div>
             ) : (
               <form action={handleSubmit} className="flex flex-col sm:flex-row md:flex-col gap-2">
                 <input name="email" required type="email" placeholder="your@email.com"
                        className="flex-1 bg-[#151515] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#32F36A]" />
                 <button disabled={status === "loading"} className="bg-white text-black font-semibold rounded-lg px-4 py-2.5 hover:bg-[#32F36A] transition-colors whitespace-nowrap">
                   {status === "loading" ? "..." : "Sign Up"}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-[#666] py-6 border-t border-white/5">
        © Desert Events Arizona {new Date().getFullYear()}
      </div>
    </footer>
  )
}
