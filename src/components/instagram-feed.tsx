"use client"

import { useEffect, useState } from "react"
import type { InstagramMediaItem } from "@/app/api/instagram/route"
import type { AdminConfig } from "@/lib/admin-config"

interface Props {
  config: AdminConfig["instagram"]
}

export function InstagramFeed({ config }: Props) {
  const [posts, setPosts] = useState<InstagramMediaItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const limit = config.postsCount ?? 9

  useEffect(() => {
    if (!config.enabled) {
      setLoading(false)
      return
    }

    async function load() {
      try {
        const res = await fetch(`/api/instagram?limit=${limit}`, { cache: "no-store" })
        const data = await res.json() as { ok: boolean; posts: InstagramMediaItem[]; error?: string }
        if (data.ok && data.posts.length > 0) {
          setPosts(data.posts)
        } else {
          // Show fallback manual posts if configured.
          if (config.fallbackPosts?.length) {
            setError(data.error ?? null)
          } else {
            setError(data.error ?? null)
          }
        }
      } catch {
        setError("Could not load Instagram posts.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [config.enabled, limit, config.fallbackPosts?.length])

  if (!config.enabled) return null

  const heading = config.heading ?? "Follow the Party"

  return (
    <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl text-white">{heading}</h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#888] hover:text-[#32F36A] transition-colors flex items-center gap-1.5"
          aria-label="View Instagram profile"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          View on Instagram
        </a>
      </div>

      {/* API env var warning (only visible when the feed is enabled but misconfigured) */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
          ⚠️ Instagram feed error: {error}
          {config.fallbackPosts?.length ? " — showing manual fallback posts." : ""}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#111] border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {posts.slice(0, limit).map((post) => {
            const thumb = post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url
            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-square overflow-hidden rounded-xl relative"
                aria-label={post.caption ? post.caption.slice(0, 80) : "View Instagram post"}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={post.caption?.slice(0, 80) ?? "Instagram post"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center text-[#555] text-xs">
                    No preview
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            )
          })}
        </div>
      ) : config.fallbackPosts?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {config.fallbackPosts.slice(0, limit).map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-[#555] text-xs hover:border-[#32F36A]/30 transition-colors"
              aria-label={post.label ?? `Instagram post ${i + 1}`}
            >
              {post.label ?? `Post ${i + 1}`}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-[#888] text-sm text-center py-8">
          No Instagram posts to display. Configure INSTAGRAM_ACCESS_TOKEN or add fallback posts in admin.
        </p>
      )}
    </section>
  )
}
