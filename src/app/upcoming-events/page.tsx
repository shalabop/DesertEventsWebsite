import { Suspense } from "react"
import UpcomingEventsContent from "./UpcomingEventsContent"

function LoadingFallback() {
  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      <section className="relative rounded-2xl overflow-hidden min-h-[40vh] md:min-h-[50vh] flex items-center px-4 md:px-8 bg-[#111]">
        <div className="relative z-10 max-w-3xl">
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-12 w-64 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-10 w-24 bg-white/10 rounded-full animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function UpcomingEventsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UpcomingEventsContent />
    </Suspense>
  )
}
