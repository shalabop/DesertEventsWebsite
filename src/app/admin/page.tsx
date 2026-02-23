"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { verifyAdminPassword } from "@/app/actions/events"
import type { AdminConfig } from "@/lib/admin-config"

// ─── Types ────────────────────────────────────────────────────────────────────

type FontSlot = "heading" | "body" | "button"
type ImageSlot = "logo" | "heroPoster"

interface Message {
  type: "success" | "error"
  text: string
}

// ─── Font Picker ──────────────────────────────────────────────────────────────

function FontPicker({
  slot,
  label,
  description,
  previewText,
  value,
  fonts,
  onChange,
}: {
  slot: FontSlot
  label: string
  description: string
  previewText: string
  value: string | null
  fonts: string[]
  onChange: (slot: FontSlot, font: string | null) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query.length > 0
    ? fonts.filter((f) => f.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : fonts.slice(0, 20)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Live-preview the font by injecting a <link> and setting the CSS variable
  function applyPreview(fontName: string | null) {
    const varName = `--font-${slot}`
    const linkId = `admin-preview-${slot}`

    // Remove existing preview link
    document.getElementById(linkId)?.remove()

    if (!fontName) {
      // Reset to default
      document.documentElement.style.removeProperty(varName)
      return
    }

    // Inject Google Fonts link
    const link = document.createElement("link")
    link.id = linkId
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)

    // Set CSS variable
    const fallback = slot === "heading"
      ? "var(--font-space-grotesk), ui-sans-serif"
      : slot === "body"
        ? "var(--font-inter), ui-sans-serif"
        : "inherit"
    document.documentElement.style.setProperty(varName, `'${fontName}', ${fallback}`)
  }

  function handleSelect(fontName: string) {
    onChange(slot, fontName)
    applyPreview(fontName)
    setQuery(fontName)
    setOpen(false)
  }

  function handleClear() {
    onChange(slot, null)
    applyPreview(null)
    setQuery("")
  }

  // Sync query display when value changes externally (e.g. reset)
  useEffect(() => {
    setQuery(value ?? "")
    applyPreview(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const displayFont = value
    ? `'${value}', system-ui, sans-serif`
    : undefined

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-white">{label}</label>
          <p className="text-xs text-[#666] mt-0.5">{description}</p>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#888] hover:text-red-400 transition-colors px-2 py-1 rounded"
            title="Reset to default"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Search input + dropdown */}
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search Google Fonts…"
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-[#32F36A] text-sm"
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-[#1A1A1A] border border-white/10 rounded-xl overflow-auto max-h-52 shadow-xl">
            {filtered.map((font) => (
              <li key={font}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(font)}
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors"
                  style={{ fontFamily: `'${font}', system-ui, sans-serif` }}
                >
                  {font}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Live preview box */}
      <div
        className="bg-[#0B0B0B] border border-white/5 rounded-xl px-5 py-4 min-h-[60px] flex items-center"
        style={displayFont ? { fontFamily: displayFont } : undefined}
      >
        <span className="text-[#C4C4C4] text-base">
          {value ? previewText : <span className="text-[#444] italic text-sm">Default font — select above to preview</span>}
        </span>
      </div>
    </div>
  )
}

// ─── Image Uploader ────────────────────────────────────────────────────────────

function ImageUploader({
  slot,
  label,
  description,
  currentUrl,
  defaultUrl,
  password,
  onChange,
}: {
  slot: ImageSlot
  label: string
  description: string
  currentUrl: string | null
  defaultUrl: string
  password: string
  onChange: (slot: ImageSlot, url: string | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const previewUrl = currentUrl ?? defaultUrl

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("password", password)

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (data.ok && data.url) {
        onChange(slot, data.url)
      } else {
        setError(data.error ?? "Upload failed")
        if (fileRef.current) fileRef.current.value = ""
      }
    } catch {
      setError("Upload failed. Please try again.")
      if (fileRef.current) fileRef.current.value = ""
    }
    setUploading(false)
  }

  function handleReset() {
    onChange(slot, null)
    if (fileRef.current) fileRef.current.value = ""
    setError(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-white">{label}</label>
          <p className="text-xs text-[#666] mt-0.5">{description}</p>
        </div>
        {currentUrl && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#888] hover:text-red-400 transition-colors px-2 py-1 rounded"
          >
            ✕ Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A] border border-white/10">
          <Image
            key={previewUrl}
            src={previewUrl}
            alt={label}
            fill
            className="object-contain p-1"
          />
        </div>

        {/* Upload input */}
        <div className="flex-1 space-y-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-[#888] file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#32F36A] file:text-black file:font-medium file:cursor-pointer file:text-sm hover:file:opacity-90 disabled:opacity-50"
          />
          <p className="text-[#555] text-xs">JPG, PNG, WebP or GIF · Max 5 MB</p>
          {uploading && <p className="text-[#888] text-xs">Uploading…</p>}
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {currentUrl && !uploading && (
            <p className="text-[#32F36A] text-xs">✓ Custom image saved</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminStylePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  const [fonts, setFonts] = useState<string[]>([])
  const [config, setConfig] = useState<AdminConfig>({
    fonts: { heading: null, body: null, button: null },
    images: { logo: null, heroPoster: null },
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    try {
      const valid = await verifyAdminPassword(password)
      if (valid) {
        setIsAuthenticated(true)
        loadData()
      } else {
        setAuthError("Invalid password")
      }
    } catch {
      setAuthError("Connection error. Please try again.")
    }
  }

  const loadData = useCallback(async () => {
    // Load current config
    try {
      const res = await fetch("/api/admin/config")
      const data = await res.json()
      setConfig(data)
    } catch {
      // ignore — defaults are already set
    }

    // Load font list
    try {
      const res = await fetch("/api/admin/fonts")
      const data = await res.json()
      if (Array.isArray(data.fonts)) setFonts(data.fonts)
    } catch {
      // ignore — fallback fonts will be empty but UI still works
    }
  }, [])

  function handleFontChange(slot: FontSlot, value: string | null) {
    setConfig((prev) => ({ ...prev, fonts: { ...prev.fonts, [slot]: value } }))
  }

  function handleImageChange(slot: ImageSlot, value: string | null) {
    setConfig((prev) => ({ ...prev, images: { ...prev.images, [slot]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, config }),
      })
      const data = await res.json()
      if (data.ok) {
        setMessage({ type: "success", text: "Settings saved! Refresh any page to see the changes applied globally." })
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to save settings." })
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." })
    }
    setSaving(false)
  }

  async function handleReset() {
    if (!confirm("Reset all font and image settings to defaults?")) return
    const defaultConfig: AdminConfig = {
      fonts: { heading: null, body: null, button: null },
      images: { logo: null, heroPoster: null },
    }
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, config: defaultConfig }),
      })
      const data = await res.json()
      if (data.ok) {
        setConfig(defaultConfig)
        // Remove live preview CSS vars
        ;(["heading", "body", "button"] as FontSlot[]).forEach((slot) => {
          document.documentElement.style.removeProperty(`--font-${slot}`)
          document.getElementById(`admin-preview-${slot}`)?.remove()
        })
        setMessage({ type: "success", text: "All settings reset to defaults." })
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to reset settings." })
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." })
    }
    setSaving(false)
  }

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <h1 className="font-display text-2xl text-white mb-1">Admin Panel</h1>
            <p className="text-[#888] text-sm mb-6">Enter the admin password to manage site appearance</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#32F36A]"
                required
                autoFocus
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

  // ── Admin panel ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0B0B] py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-3xl text-white">Site Appearance</h1>
            <p className="text-[#888] text-sm mt-1">Change fonts and images across the whole website</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events"
              className="text-sm text-[#888] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Event Manager →
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-[#666] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm ${
              message.type === "success"
                ? "bg-[#32F36A]/10 border-[#32F36A] text-[#32F36A]"
                : "bg-red-500/10 border-red-500 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ── Section 1: Typography ─────────────────────────────────────────────── */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-white mb-1">Typography</h2>
          <p className="text-[#666] text-sm mb-6">
            Choose a Google Font for each text style. Changes preview instantly — save when happy.
          </p>

          <div className="space-y-8">
            <FontPicker
              slot="heading"
              label="Heading Font"
              description="Used for all titles, section headings, brand names (h1, h2, h3)"
              previewText="Arizona's Leading Nightlife Collective"
              value={config.fonts.heading}
              fonts={fonts}
              onChange={handleFontChange}
            />
            <div className="border-t border-white/5" />
            <FontPicker
              slot="body"
              label="Body Font"
              description="Used for paragraphs, descriptions, navigation links, and all general text"
              previewText="Creating culture in the desert — unforgettable nights."
              value={config.fonts.body}
              fonts={fonts}
              onChange={handleFontChange}
            />
            <div className="border-t border-white/5" />
            <FontPicker
              slot="button"
              label="Button Font"
              description="Used for call-to-action buttons (defaults to body font if left blank)"
              previewText="Join the Guestlist · Book a Table"
              value={config.fonts.button}
              fonts={fonts}
              onChange={handleFontChange}
            />
          </div>
        </section>

        {/* ── Section 2: Images ─────────────────────────────────────────────────── */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-white mb-1">Images</h2>
          <p className="text-[#666] text-sm mb-6">
            Upload new images for key site elements. Current images shown as thumbnails.
          </p>

          <div className="space-y-8">
            <ImageUploader
              slot="logo"
              label="Logo"
              description="Appears in the navigation bar and loading screen"
              currentUrl={config.images.logo}
              defaultUrl="/de-badge.png"
              password={password}
              onChange={handleImageChange}
            />
            <div className="border-t border-white/5" />
            <ImageUploader
              slot="heroPoster"
              label="Hero Background Image"
              description="Shown as the background when the hero video hasn't loaded yet"
              currentUrl={config.images.heroPoster}
              defaultUrl="/hero.jpg"
              password={password}
              onChange={handleImageChange}
            />
          </div>
        </section>

        {/* ── Section 3: Save / Reset ───────────────────────────────────────────── */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-display text-xl text-white mb-4">Save Changes</h2>
          <p className="text-[#666] text-sm mb-5">
            Clicking "Save Changes" will apply your font and image selections to every page on the site.
            You can always reset back to the original defaults.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#32F36A] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50 text-sm"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5 text-xs text-[#555] space-y-1">
            <p>Font changes take effect on the next full page load after saving.</p>
            <p>
              Uploaded images are stored in <code className="bg-[#1A1A1A] px-1 rounded">/public/uploads/</code>.{" "}
              On cloud deployments (e.g. Vercel), switch to Supabase Storage for permanent uploads.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
