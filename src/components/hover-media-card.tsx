"use client"

import { useRef, useState, useCallback } from "react"

interface HoverMediaCardProps {
  /** Static image shown by default. */
  imageUrl: string
  /** Alt text for the static image. */
  imageAlt: string
  /** Optional video URL; if present the video plays on hover/focus. */
  hoverVideoUrl?: string | null
  /** Extra CSS classes applied to the card container. */
  className?: string
  children?: React.ReactNode
}

/**
 * A media card that shows a static image at rest and, when a hoverVideoUrl is
 * provided, plays a muted looping video on pointer enter / focus.
 *
 * Mobile: hover events don't fire reliably; the component gracefully falls back
 * to showing the static image — no broken layout or infinite-play.
 */
export function HoverMediaCard({
  imageUrl,
  imageAlt,
  hoverVideoUrl,
  className = "",
  children,
}: HoverMediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleEnter = useCallback(() => {
    if (!hoverVideoUrl) return
    setIsHovering(true)
    videoRef.current?.play().catch(() => {/* blocked — static image stays visible */})
  }, [hoverVideoUrl])

  const handleLeave = useCallback(() => {
    if (!hoverVideoUrl) return
    setIsHovering(false)
    const el = videoRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
  }, [hoverVideoUrl])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={hoverVideoUrl ? 0 : undefined}
    >
      {/* Static image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isHovering && hoverVideoUrl ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Hover video */}
      {hoverVideoUrl && (
        <video
          ref={videoRef}
          src={hoverVideoUrl}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {children}
    </div>
  )
}
