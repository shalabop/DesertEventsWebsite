"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLead } from "@/app/actions/submitLead"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// FIX: Use z.coerce.number() to handle HTML inputs automatically
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email"),
  venue: z.string().min(1, "Pick a venue"),
  date: z.string().min(1, "Pick a date"),
  party_size: z.coerce.number().int().positive().min(1, "Party size must be > 0"),
  intent: z.enum(["guestlist","table"]),
  budget_range: z.string().default(""),
  arrival_window: z.string().default(""),
  notes: z.string().default(""),
})

const VENUES = [
  { name: "Riot House", vibe: "EDM/hip-hop, high energy", img: "/venues/riot-house.jpg" },
  { name: "El Hefe", vibe: "Latin + party crowd", img: "/venues/el-hefe.jpg" },
  { name: "Cake", vibe: "Nightclub atmosphere, VIP tables", img: "/venues/cake.jpg" },
  { name: "Whiskey Row", vibe: "Country crossover", img: "/venues/whiskey-row.jpg" },
]

export default function ScottsdaleGuestlistClient() {
  const [result, setResult] = useState<{ok:boolean; error?:string}>()
  const [pending, startTransition] = useTransition()
  
  // FIX: Removed <FormValues> generic. Letting TS infer the type prevents the build error.
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      intent: "guestlist" as const,
      party_size: 4,
      venue: VENUES[0].name,
      name: "",
      phone: "",
      email: "",
      date: "",
      budget_range: "",
      arrival_window: "",
      notes: ""
    }
  })
  
  // Watch requires explicit casting sometimes if inference is tricky, but usually fine here
  const intent = form.watch("intent")

  return (
    <div className="space-y-12 md:space-y-16 pb-20">
      {/* HERO */}
      <section className="relative rounded-2xl overflow-hidden min-h-[60vh] flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 -z-10">
          <img src="/hero.jpg" alt="" className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#32F36A] uppercase tracking-widest text-sm mb-4">Scottsdale GuestList</p>
          <h1 className="font-display text-4xl md:text-6xl mb-6 text-white">
            Priority entry & bottle service at Old Town’s top venues.
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#guestlist-form" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-[#32F36A] transition-colors">Join Guestlist</a>
            <a href="#guestlist-form" className="bg-[#32F36A] text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors">Book Table</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-screen-xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { step: "01", title: "Pick Your Venue", desc: "Browse Old Town's best spots below." },
            { step: "02", title: "Send Details", desc: "Select your date and party size." },
            { step: "03", title: "We Confirm", desc: "Our concierge texts you the confirmation." },
          ].map((s) => (
            <div key={s.step} className="p-6 rounded-2xl bg-[#111] border border-white/5">
               <div className="text-[#32F36A] font-display text-4xl mb-2">{s.step}</div>
               <h3 className="text-xl font-bold mb-2">{s.title}</h3>
               <p className="text-[#888]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VENUES GRID */}
      <section className="max-w-screen-xl mx-auto px-6">
        <h2 className="font-display text-3xl mb-8">Participating Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VENUES.map(v => (
            <article key={v.name} className="group">
              <div className="relative h-[250px] overflow-hidden rounded-2xl mb-3">
                <img src={v.img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={v.name} />
              </div>
              <div className="font-display text-xl">{v.name}</div>
              <div className="text-sm text-[#888]">{v.vibe}</div>
            </article>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="guestlist-form" className="max-w-screen-lg mx-auto px-6">
        <div className="rounded-3xl border border-white/10 p-8 md:p-12 bg-[#111]">
            <h2 className="font-display text-3xl mb-2">Booking Form</h2>
            <p className="text-[#888] mb-8">Complete your details—our concierge will text to confirm.</p>
            
            <form onSubmit={form.handleSubmit(values => {
                setResult(undefined)
                startTransition(async () => {
                  const res = await submitLead({ ...values, source_page: "scottsdale-guestlist" })
                  setResult(res as any)
                  if (res.ok) {
                    form.reset({ 
                      intent: "guestlist", 
                      party_size: 4, 
                      venue: VENUES[0].name,
                      name: "", phone: "", email: "", date: "",
                      budget_range:"", arrival_window:"", notes:"" 
                    })
                  }
                })
              })} className="grid md:grid-cols-2 gap-6">
               
               <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Full Name</label>
                  <input className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-red-400 text-xs">{form.formState.errors.name.message as string}</p>}
               </div>

               <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Phone</label>
                  <input className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("phone")} />
                  {form.formState.errors.phone && <p className="text-red-400 text-xs">{form.formState.errors.phone.message as string}</p>}
               </div>

               <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Email</label>
                  <input className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-red-400 text-xs">{form.formState.errors.email.message as string}</p>}
               </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Venue</label>
                  <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("venue")}>
                      {VENUES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Date</label>
                  <input type="date" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A] [color-scheme:dark]" {...form.register("date")} />
                  {form.formState.errors.date && <p className="text-red-400 text-xs">{form.formState.errors.date.message as string}</p>}
               </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Party Size</label>
                  <input type="number" min={1} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" 
                    {...form.register("party_size")} />
                  {form.formState.errors.party_size && <p className="text-red-400 text-xs">{form.formState.errors.party_size.message as string}</p>}
               </div>

               <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Intent</label>
                  <div className="flex gap-6 pt-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="radio" value="guestlist" className="w-5 h-5 accent-[#32F36A]" {...form.register("intent")} /> 
                       <span>Join Guestlist</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="radio" value="table" className="w-5 h-5 accent-[#32F36A]" {...form.register("intent")} /> 
                       <span>Book Table</span>
                     </label>
                  </div>
               </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Budget (Optional)</label>
                  <input className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("budget_range")} />
               </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Arrival Window (Optional)</label>
                  <input className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("arrival_window")} />
               </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-[#C4C4C4]">Notes (Optional)</label>
                  <textarea rows={4} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#32F36A]" {...form.register("notes")} />
               </div>

               <div className="md:col-span-2 pt-4">
                  <button disabled={pending} className="w-full bg-[#32F36A] text-black font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {pending ? "Submitting..." : "Submit Request"}
                  </button>
               </div>
            </form>

             {result?.ok && (
               <div className="mt-6 p-4 rounded-xl bg-[#32F36A]/10 border border-[#32F36A] text-[#32F36A] text-center">
                 ✅ Confirmed! Look out for a text from our team.
               </div>
             )}
             {result?.error && (
               <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500 text-red-400 text-center">
                 ❌ {result.error}
               </div>
             )}
         </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-screen-md mx-auto px-6">
        <h2 className="font-display text-2xl mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border-b border-white/10 pb-4">
            <AccordionTrigger className="hover:text-[#32F36A] text-lg">What are table minimums?</AccordionTrigger>
            <AccordionContent className="text-[#C4C4C4] pt-2">Minimums start at $500-$1000 depending on the venue and night. Our concierge will confirm pricing.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b border-white/10 pb-4">
            <AccordionTrigger className="hover:text-[#32F36A] text-lg">When should we arrive?</AccordionTrigger>
            <AccordionContent className="text-[#C4C4C4] pt-2">Guestlist entry usually closes by 10:30 PM. Table reservations should arrive by 11:00 PM.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b border-white/10 pb-4">
            <AccordionTrigger className="hover:text-[#32F36A] text-lg">What is the dress code?</AccordionTrigger>
            <AccordionContent className="text-[#C4C4C4] pt-2">Upscale casual. No athletic wear, flip flops, or excessively baggy clothes.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}