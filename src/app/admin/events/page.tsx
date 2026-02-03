"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { createEvent, updateEvent, deleteEvent, getEvents, verifyAdminPassword, uploadEventImage, EventData, EventType } from "@/app/actions/events"

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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [imageSource, setImageSource] = useState<"gallery" | "upload">("gallery")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setAuthError("")
    try {
      const isValid = await verifyAdminPassword(password)
      if (isValid) {
        setIsAuthenticated(true)
        loadEvents()
      } else {
        setAuthError("Invalid password")
      }
    } catch (err) {
      setAuthError("Connection error. Please try again.")
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    try {
      const result = await getEvents()
      if (result.ok) {
        setEvents(result.data)
      }
    } catch (err) {
      console.error("Failed to load events:", err)
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
    setImageSource("gallery")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setMessage(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const result = await uploadEventImage(formDataUpload, password)

      if (result.ok && result.url) {
        setFormData({ ...formData, image: result.url })
        setMessage({ type: "success", text: "Image uploaded successfully!" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to upload image" })
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to upload image" })
    }
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
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
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "An error occurred. Please try again." })
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
    // Check if image is from gallery or uploaded
    const isGalleryImage = defaultImages.some(img => img.value === event.image)
    setImageSource(isGalleryImage ? "gallery" : "upload")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setLoading(true)
    try {
      const result = await deleteEvent(id, password)
      if (result.ok) {
        setMessage({ type: "success", text: "Event deleted!" })
        loadEvents()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete event" })
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to delete event" })
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

              {/* Image Source Toggle */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#888] mb-2">Event Image</label>
                <div className="flex gap-4 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageSource("gallery")}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      imageSource === "gallery"
                        ? "bg-[#32F36A] text-black"
                        : "bg-[#1A1A1A] text-[#888] hover:text-white"
                    }`}
                  >
                    Choose from Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource("upload")}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      imageSource === "upload"
                        ? "bg-[#32F36A] text-black"
                        : "bg-[#1A1A1A] text-[#888] hover:text-white"
                    }`}
                  >
                    Upload New Image
                  </button>
                </div>

                {imageSource === "gallery" ? (
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32F36A]"
                  >
                    {defaultImages.map((img) => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#32F36A] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#32F36A] file:text-black file:font-medium file:cursor-pointer"
                    />
                    {uploadingImage && (
                      <p className="text-[#888] text-sm">Uploading image...</p>
                    )}
                    <p className="text-[#666] text-xs">Supports JPG, PNG, WebP, GIF. Max 5MB.</p>
                  </div>
                )}

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
                disabled={loading || uploadingImage}
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
            <div className="text-center py-8">
              <p className="text-[#888] mb-2">No events yet.</p>
              <p className="text-[#666] text-sm">Add your first event using the form above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
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

        {/* Setup Instructions */}
        <div className="mt-8 p-6 bg-[#111] border border-white/10 rounded-2xl">
          <h3 className="font-display text-lg text-white mb-3">Setup Instructions</h3>
          <div className="space-y-4 text-sm text-[#888]">
            <div>
              <p className="text-white font-medium mb-1">1. Create Events Table (Supabase SQL Editor):</p>
              <pre className="bg-[#0B0B0B] p-3 rounded-lg overflow-x-auto text-xs">
{`CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  image TEXT DEFAULT '/gallery/1.jpg',
  description TEXT NOT NULL,
  ticket_link TEXT DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
            </div>
            <div>
              <p className="text-white font-medium mb-1">2. For Image Uploads - Create Storage Bucket:</p>
              <ul className="list-disc list-inside space-y-1 text-[#666]">
                <li>Go to Supabase → Storage → Create Bucket</li>
                <li>Name it: <code className="bg-[#0B0B0B] px-1 rounded">event-images</code></li>
                <li>Make it public (toggle Public bucket)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
