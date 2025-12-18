"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLead } from "@/app/actions/submitLead"

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email"),
  venue: z.string().min(1, "Pick a venue"),
  date: z.string().min(1, "Pick a date"),
  party_size: z.coerce.number().int().positive("Party size must be > 0"),
  intent: z.enum(["guestlist","table"]),
  budget_range: z.string().optional().default(""),
  arrival_window: z.string().optional().default(""),
  notes: z.string().optional().default(""),
})
type FormValues = z.infer<typeof schema>

const VENUES = [
  { name: "Riot House", vibe: "EDM/hip-hop, high energy", img: "/venues/riot-house.jpg" },
  { name: "El Hefe", vibe: "Latin + party crowd", img: "/venues/el-hefe.jpg" },
  { name: "Cake", vibe: "Nightclub atmosphere, VIP tables", img: "/venues/cake.jpg" },
  { name: "Whiskey Row", vibe: "Country crossover", img: "/venues/whiskey-row.jpg" },
]

export default function ScottsdaleGuestlistClient() {
  const [result, setResult] = useState<{ok:boolean; error?:string}>()
  const [pending, startTransition] = useTransition()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      intent: "guestlist",
      party_size: 4,
      venue: VENUES[0].name,
    }
  })
  const intent = form.watch("intent")

  return (
    <div className="space-y-12 md:space-y-16">
      {/* HERO */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="ff-vignette" />
        </div>
        <div className="relative z-10 px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 max-w-screen-xl mx-auto">
          <p className="ff-eyebrow">Scottsdale GuestList</p>
          <h1 className="font-display text-3xl md:text-5xl leading-[1.05] max-w-4xl">
            Priority entry and bottle service at Old Town’s top venues — powered by Desert Events.
          </h1>
          <p className="text-[#C4C4C4] max-w-2xl mt-3">
            Join the guestlist or request a VIP table—our concierge will text to confirm.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#guestlist-form" className="ff-cta">Join Guestlist</a>
            <a href="#guestlist-form" className="ff-link">Book Table →</a>
          </div>
        </div>
      </section>

      {/* VENUES (mini grid) */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="ff-grid">
          {VENUES.map(v => (
            <article key={v.name} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div className="relative h-[200px] overflow-hidden rounded-2xl"><img src={v.img} className="ff-img" /></div>
              <div className="mt-2 font-display">{v.name}</div>
              <div className="text-sm text-[#C4C4C4]">{v.vibe}</div>
            </article>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="guestlist-form" className="max-w-screen-xl mx-auto px-5 md:px-8">
        <div className="rounded-2xl border border-white/10 p-6 bg-[#111111]">
          <div className="font-display text-2xl mb-2">Booking Form</div>
          <p className="text-[#C4C4C4] mb-4">Complete your details—our concierge will text to confirm.</p>

          <form
            onSubmit={form.handleSubmit(values => {
              setResult(undefined)
              startTransition(async () => {
                const res = await submitLead({ ...values, source_page: "scottsdale-guestlist" })
                setResult(res as any)
                if (res.ok) form.reset({ intent: "guestlist", party_size: 4, venue: VENUES[0].name })
              })
            })}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <label htmlFor="name">Full Name</label>
              <input id="name" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="John Appleseed" {...form.register("name")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone">Phone</label>
              <input id="phone" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="(555) 555-5555" {...form.register("phone")} />
              <div className="text-xs text-[#C4C4C4]">You consent to texts for coordination.</div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="email">Email</label>
              <input id="email" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="you@example.com" {...form.register("email")} />
            </div>

            <div className="space-y-2">
              <label>Venue</label>
              <select className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3"
                      defaultValue={VENUES[0].name}
                      onChange={(e)=>form.setValue("venue", e.target.value)}>
                {VENUES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" {...form.register("date")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="party_size">Party Size</label>
              <input id="party_size" type="number" min={1} className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" {...form.register("party_size", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <span>Intent</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" value="guestlist" defaultChecked onChange={()=>form.setValue("intent","guestlist")} />
                  Join Guestlist
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="table" onChange={()=>form.setValue("intent","table")} />
                  Book Table
                </label>
              </div>
            </div>

            {intent === "table" && (
              <div className="md:col-span-2 rounded-xl border border-white/10 p-4 text-sm text-[#C4C4C4]">
                A small deposit may be required to secure VIP tables. Our concierge will confirm by text.
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="budget_range">Budget Range (optional)</label>
              <input id="budget_range" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="$500–$1500" {...form.register("budget_range")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="arrival_window">Arrival Window (optional)</label>
              <input id="arrival_window" className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="10:30–11:15 PM" {...form.register("arrival_window")} />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" rows={4} className="rounded-xl bg-[#151515] border border-white/10 px-4 py-3" placeholder="Occasion, preferences, host name…" {...form.register("notes")} />
            </div>

            <div className="md:col-span-2">
              <button disabled={pending} className="ff-cta">{pending ? "Submitting..." : "Submit"}</button>
            </div>
          </form>

          {result?.ok && (
            <div className="mt-4 rounded-xl border border-white/10 p-4 text-sm">
              ✅ Thanks! You’re confirmed. Tell the door: <b>“On Desert Events guestlist.”</b>
            </div>
          )}
          {result?.error && (
            <div className="mt-4 rounded-xl border border-red-800 text-red-300 p-4 text-sm">
              ❌ {result.error}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
