"use client"

import { useState, useEffect } from "react"
import { createEvent, updateEvent, deleteEvent, getEvents, verifyAdminPassword, EventData, EventType } from "@/app/actions/events"

const eventTypes: { value: EventType; label: string }[] = [
  { value: "le-tour-de-crawl", label: "Le Tour De Crawl" },
  { value: "society-sessions", label: "Society Sessions" },
  { value: "scottsdale-guestlist", label: "Scottsdale Guestlist" },
  { value: "other", label: "Other" },
]

const defaultImages = [
  { value: "/gallery/1.jpg", label: "Gallery 1" },
  { value: "/gallery/2.jpg", label: "Gallery 2" },
  { value: "/gallery/3.jpg", label: "Gallery 3" },
  { value: "/gallery/4.jpg", label: "Gallery 4" },
  { value: "/gallery/5.jpg", label: "Gallery 5" },
  { value: "/gallery/6.jpg", label: "Gallery 6" },
]

export default function AdminEventsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)

  const [formData, setFormData] = useState<EventData>({
    title: "",
    date: "",
    time: "",
    venue: "",
    city: "",
    type: "le-tour-de-crawl",
    image: "/gallery/1.jpg",
    description: "",
    ticket_link: "#"
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await verifyAdminPassword(password)
    if (isValid) {
      setIsAuthenticated(true)
      setAuthError("")
      loadEvents()
    } else {
      setAuthError("Invalid password")
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    const result = await getEvents()
    if (result.ok) {
      setEvents(result.data)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      venue: "",
      city: "",
      type: "le-tour-de-crawl",
      image: "/gallery/1.jpg",
      description: "",
      ticket_link: "#"
    })
    setEditingEvent(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    let result
    if (editingEvent?.id) {
      result = await updateEvent(editingEvent.id, formData, password)
    } else {
      result = await createEvent(formData, password)
    }

    if (result.ok) {
      setMessage({ type: "success", text: editingEvent ? "Event updated!" : "Event created!" })
      resetForm()
      loadEvents()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save event" })
    }
    setLoading(false)
  }

  const handleEdit = (event: EventData) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      city: event.city,
      type: event.type,
      image: event.image,
      description: event.description,
      ticket_link: event.ticket_link
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setLoading(true)
    const result = await deleteEvent(id, password)
    if (result.ok) {
      setMessage({ type: "success", text: "Event deleted!" })
      loadEvents()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete event" })
    }
    setLoading(false)
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <h1 className="font-display text-2xl text-white mb-2">Admin Login</h1>
            <p className="text-[#888] text-sm mb-6">Enter the admin password to manage events</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                required
              />
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <button
                type="submit"
                className="w-full bg-[#32F36A] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl text-white">Event Manager</h1>
            <p className="text-[#888] text-sm mt-1">Add, edit, and delete upcoming events</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-[#888] hover:text-white text-sm"
          >
            Logout
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-[#32F36A]/10 border-[#32F36A] text-[#32F36A]"
              : "bg-red-500/10 border-red-500 text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl text-white mb-4">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#888] mb-1">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ugly Sweater Crawl"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-[#888] mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32F36A] [color-scheme:dark]"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm text-[#888] mb-1">Time *</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. 4:00 PM - 11:00 PM"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                  required
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm text-[#888] mb-1">Venue *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Riot House"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-[#888] mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Scottsdale"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm text-[#888] mb-1">Event Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32F36A]"
                  required
                >
                  {eventTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm text-[#888] mb-1">Image</label>
                <select
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32F36A]"
                >
                  {defaultImages.map((img) => (
                    <option key={img.value} value={img.value}>{img.label}</option>
                  ))}
                </select>
              </div>

              {/* Ticket Link */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#888] mb-1">Ticket Link</label>
                <input
                  type="text"
                  value={formData.ticket_link}
                  onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
                  placeholder="https://eventbrite.com/... or /scottsdale-guestlist"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#888] mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the event..."
                  rows={3}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A] resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#32F36A] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : editingEvent ? "Update Event" : "Add Event"}
              </button>
              {editingEvent && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Events List */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-display text-xl text-white mb-4">All Events ({events.length})</h2>

          {loading && events.length === 0 ? (
            <p className="text-[#888]">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-[#888]">No events yet. Add your first event above!</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-white/5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-medium truncate">{event.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#888]">
                        {eventTypes.find(t => t.value === event.type)?.label}
                      </span>
                    </div>
                    <p className="text-[#888] text-sm mt-1">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })} • {event.venue}, {event.city}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id!)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-[#111] border border-white/10 rounded-2xl">
          <h3 className="font-display text-lg text-white mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-[#888]">
            <li>• <strong className="text-white">Date format:</strong> Use the date picker to select the event date</li>
            <li>• <strong className="text-white">Time format:</strong> Use format like "4:00 PM - 11:00 PM"</li>
            <li>• <strong className="text-white">Ticket Link:</strong> Paste full URL or use "/scottsdale-guestlist" for internal links</li>
            <li>• <strong className="text-white">Event Type:</strong> Choose the category that best fits the event</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
