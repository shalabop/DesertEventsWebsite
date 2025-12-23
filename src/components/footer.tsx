"use client"
import { subscribeNewsletter } from "@/app/actions/forms"
import { useState } from "react"

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
      <div className="max-w-screen-xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div className="md:col-span-1">
          <div className="font-display text-lg">Desert Events Arizona</div>
          <p className="text-[#C4C4C4] mt-3 leading-relaxed">
            Arizona’s leading nightlife & event collective. <br/>
            Creating culture in the desert.
          </p>
        </div>
        
        <div>
          <div className="font-semibold mb-3 text-white">Brands</div>
          <ul className="space-y-2 text-[#C4C4C4]">
            <li><a className="hover:text-[#32F36A] transition-colors" href="/scottsdale-guestlist">Scottsdale GuestList</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="/le-tour-de-crawl">Le Tour De Crawl</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="/society-sessions">Society Sessions</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="/tableworthy">Tableworthy</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3 text-white">Social</div>
          <ul className="space-y-2 text-[#C4C4C4]">
            <li><a className="hover:text-[#32F36A] transition-colors" href="https://www.instagram.com/deserteventsarizona/" target="_blank">Instagram</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="https://tiktok.com" target="_blank">TikTok</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="https://linkedin.com" target="_blank">LinkedIn</a></li>
            <li><a className="hover:text-[#32F36A] transition-colors" href="https://youtube.com" target="_blank">YouTube</a></li>
          </ul>
        </div>

        <div className="md:col-span-1">
           <div className="font-semibold mb-3 text-white">Newsletter</div>
           {status === "success" ? (
             <div className="text-[#32F36A]">You're on the list.</div>
           ) : (
             <form action={handleSubmit} className="flex flex-col gap-2">
               <input name="email" required type="email" placeholder="your@email.com" 
                      className="bg-[#151515] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#32F36A]" />
               <button disabled={status === "loading"} className="bg-white text-black font-semibold rounded-lg px-3 py-2 hover:bg-[#32F36A] transition-colors">
                 {status === "loading" ? "..." : "Sign Up"}
               </button>
             </form>
           )}
        </div>
      </div>
      <div className="text-center text-xs text-[#666] py-6 border-t border-white/5">
        © Desert Events Arizona 2025
      </div>
    </footer>
  )
}