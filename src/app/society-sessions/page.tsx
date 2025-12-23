"use client"
import Image from "next/image"
import { submitLead } from "@/app/actions/submitLead"

export default function SocietySessionsPage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="relative rounded-2xl overflow-hidden min-h-[50vh] flex items-center px-8">
        <Image src="/gallery/3.jpg" alt="Society Sessions" fill className="object-cover brightness-[0.4]" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-display text-5xl md:text-7xl mb-4">Society Sessions</h1>
          <p className="text-xl text-[#C4C4C4]">Exclusive rooftop and coffeehouse sessions centered around house music and community.</p>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-3xl mb-6">Upcoming Sessions</h2>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-4 border border-white/10 rounded-xl bg-[#111]">
                <div className="w-24 h-24 bg-white/10 rounded-lg relative overflow-hidden">
                   <Image src={`/gallery/${i}.jpg`} fill className="object-cover" alt="" />
                </div>
                <div>
                  <div className="text-[#32F36A] font-mono text-sm">SUN, NOV {10+i}</div>
                  <h3 className="font-display text-xl">Rooftop Sunset</h3>
                  <p className="text-[#888] text-sm">Canopy Hotel • 4pm - 9pm</p>
                  <button className="text-sm underline mt-2">RSVP</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-8 rounded-2xl border border-white/10">
          <h3 className="font-display text-2xl mb-4">Join The Community</h3>
          <p className="text-[#888] mb-6">Get invited to private sessions.</p>
          <form action={async (formData) => {
             // Adapt this to call submitLead with specific intent
             const name = formData.get("name") as string
             const email = formData.get("email") as string
             await submitLead({ 
               name, email, phone: "0000000000", venue: "Society", date: "N/A", 
               party_size: 1, intent: "guestlist", source_page: "society-sessions" 
             })
             alert("You're on the list!")
          }} className="space-y-4">
             <input name="name" placeholder="Name" className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
             <input name="email" placeholder="Email" className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 rounded-xl" />
             <button className="w-full bg-[#32F36A] text-black font-bold py-3 rounded-xl">Join Guestlist</button>
          </form>
        </div>
      </section>
    </div>
  )
}