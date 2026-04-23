"use client"

import { useRef, useEffect } from "react"

interface MediaBackgroundProps {
  /** URL for the static fallback image (poster). */
  posterUrl?: string | null
  /** Optional video URL. When provided the video autoplays muted/looped. */
  videoUrl?: string | null
  /** 0–100 brightness percentage applied as an overlay. Defaults to 50. */
  brightness?: number
  /** Extra CSS classes applied to the root wrapper. */
  className?: string
  children?: React.ReactNode
}

/**
 * Full-bleed background that shows a static image by default and, when a
 * videoUrl is supplied, autoplays a muted looping video on top.
 *
 * Usage:
 *   <MediaBackground posterUrl="/hero.jpg" videoUrl={config.heroVideo} brightness={45}>
 *     <h1>Hello</h1>
 *   </MediaBackground>
 */
export function MediaBackground({
  posterUrl,
  videoUrl,
  brightness = 50,
  className = "",
  children,
}: MediaBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Attempt autoplay; browsers may block it until the user interacts.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.play().catch(() => {
      // Autoplay blocked — the poster image is already visible as fallback.
    })
  }, [videoUrl])

  const overlayStyle = {
    background: `rgba(0,0,0,${(100 - brightness) / 100})`,
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Static poster / fallback image */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video layer — rendered only when a URL is available */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          poster={posterUrl ?? undefined}
        />
      )}

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0" style={overlayStyle} aria-hidden="true" />

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
