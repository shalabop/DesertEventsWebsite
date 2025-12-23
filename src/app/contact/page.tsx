"use client"
import { submitContact } from "@/app/actions/forms"

export default function ContactPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
      <div>
        <h1 className="font-display text-5xl mb-6">Partnerships & Contact</h1>
        <p className="text-[#C4C4C4] text-lg mb-8">
          Tell us about your brand, budget, and goals. We’ll get back quickly.
        </p>
        <div className="space-y-4 text-[#888]">
          <p>For bookings, please use the Scottsdale GuestList page.</p>
          <p>Email: <a href="mailto:gabe@deserteventsaz.com" className="text-white underline">gabe@deserteventsaz.com</a></p>
        </div>
      </div>

      <form action={async (fd) => {
          const data = Object.fromEntries(fd)
          await submitContact(data)
          alert("Message sent.")
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <input name="name" placeholder="Name" required className="bg-[#111] border border-white/10 px-4 py-3 rounded-xl" />
           <input name="email" type="email" placeholder="Email" required className="bg-[#111] border border-white/10 px-4 py-3 rounded-xl" />
        </div>
        <input name="company" placeholder="Company / Brand" className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl" />
        <input name="budget" placeholder="Budget Range" className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl" />
        <textarea name="message" placeholder="Message" required rows={5} className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl" />
        <button className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-[#32F36A] transition-colors">Send Message</button>
      </form>
    </div>
  )
}