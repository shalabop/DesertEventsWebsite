"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Keep the loader visible for 2.5 seconds to show off the animation
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0B0B]"
          style={{ perspective: "1000px" }} // Essential for the 3D effect
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: 0, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1.5],     // Grows "out of the screen"
              rotateY: [0, 180, 360],    // Full 3D spin
              opacity: [0, 1, 1]         // Fades in quickly
            }}
            transition={{ 
              duration: 2,               // Duration of one cycle
              ease: "easeInOut", 
              times: [0, 0.5, 1],        // Keyframe timing
              repeat: Infinity,          // Loops until loaded
              repeatDelay: 0 
            }}
            className="w-32 h-32 md:w-48 md:h-48 relative preserve-3d"
          >
            {/* Using the badge logo for the best spin effect */}
            <Image 
              src="/de-badge.png" 
              alt="Loading" 
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(50,243,106,0.4)]" 
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}