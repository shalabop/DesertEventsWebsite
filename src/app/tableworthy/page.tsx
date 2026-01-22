"use client"
import Image from "next/image"
import { submitTableworthy } from "@/app/actions/forms"

export default function TableworthyPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="relative rounded-2xl overflow-hidden min-h-[50vh] flex items-center px-8">
        <Image src="/gallery/TW.png" alt="Tableworthy" fill className="object-cover brightness-[0.4]" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-display text-5xl md:text-7xl mb-4">Tableworthy</h1>
          <p className="text-xl text-[#C4C4C4]">Hospitality marketing connecting influencers, restaurants, and brands through curated experiences.</p>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {["Influencer Dinners", "UGC & Brand Activations", "Experiential Partnerships"].map((s, i) => (
          <div key={s} className="p-8 rounded-2xl bg-[#111] border border-white/10">
             <h3 className="font-display text-2xl mb-2">{s}</h3>
             <p className="text-[#888]">Curated campaigns that drive visibility and authentic content creation.</p>
          </div>
        ))}
      </section>

      <section className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
         <div>
            <h2 className="font-display text-4xl mb-4">Book a Campaign</h2>
            <p className="text-[#C4C4C4]">Tell us your goals. We'll curate the crowd.</p>
         </div>
         <form action={async (fd) => {
            const data = Object.fromEntries(fd)
            await submitTableworthy(data)
            alert("Received!")
         }} className="space-y-4 bg-[#111] p-8 rounded-2xl border border-white/10">
            <input name="name" placeholder="Contact Name" className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
            <input name="email" placeholder="Email" className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
            <input name="brand" placeholder="Brand / Restaurant" className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
            <textarea name="message" placeholder="Project Details" rows={4} className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
            <button className="w-full bg-[#32F36A] text-black font-bold py-3 rounded-xl">Submit Inquiry</button>
         </form>
      </section>
    </div>
  )
}