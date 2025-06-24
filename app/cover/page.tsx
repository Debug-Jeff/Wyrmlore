"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play } from "lucide-react"
import Link from "next/link"

export default function CoverPage() {
  const [showCover, setShowCover] = useState(true)

  useEffect(() => {
    // Cover page disappears after 3 seconds
    const timer = setTimeout(() => {
      setShowCover(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showCover && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-red-950 overflow-hidden"
        >
          {/* Enhanced Cave Environment */}
          <div className="absolute inset-0">
            {/* Deep cave shadows with multiple layers */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/60 to-slate-950" />
              <div className="absolute top-0 left-0 w-3/4 h-full bg-gradient-to-br from-slate-800/30 to-transparent" />
              <div className="absolute bottom-0 right-0 w-3/4 h-full bg-gradient-to-tl from-red-950/40 to-transparent" />
              <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gradient-radial from-red-900/20 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Dynamic fire light sources */}
            <motion.div
              className="absolute top-20 right-32 w-48 h-48 bg-gradient-radial from-orange-400 via-red-500 to-transparent rounded-full blur-3xl"
              animate={{
                opacity: [0.3, 0.8, 0.4, 0.9, 0.5],
                scale: [1, 1.4, 0.8, 1.3, 1],
                x: [0, 10, -5, 8, 0],
                y: [0, -8, 5, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-24 left-24 w-32 h-32 bg-gradient-radial from-red-400 via-orange-500 to-transparent rounded-full blur-2xl"
              animate={{
                opacity: [0.2, 0.7, 0.3, 0.8, 0.4],
                scale: [1, 1.2, 0.9, 1.1, 1],
                x: [0, -8, 5, -6, 0],
                y: [0, 8, -3, 6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />

            {/* Ancient runes */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1200 800">
                <defs>
                  <pattern id="ancientRunes" x="0" y="0" width="400" height="300" patternUnits="userSpaceOnUse">
                    <text x="60" y="80" className="fill-red-400 text-4xl font-bold" opacity="0.5" style={{ fontFamily: 'serif' }}>
                      ᚦᚱᚨᚷᛟᚾ
                    </text>
                    <text x="60" y="140" className="fill-orange-500 text-3xl font-bold" opacity="0.4" style={{ fontFamily: 'serif' }}>
                      ᚹᚤᚱᛗᛚᛟᚱᛖ
                    </text>
                    <text x="220" y="110" className="fill-red-300 text-2xl font-bold" opacity="0.4" style={{ fontFamily: 'serif' }}>
                      ᚠᛁᚱᛖ
                    </text>
                    <text x="80" y="200" className="fill-orange-400 text-xl font-bold" opacity="0.3" style={{ fontFamily: 'serif' }}>
                      ᛞᚱᚨᚲᛟ
                    </text>
                    <circle cx="280" cy="60" r="3" className="fill-red-400" opacity="0.6" />
                    <circle cx="120" cy="220" r="2" className="fill-orange-400" opacity="0.5" />
                    <circle cx="320" cy="180" r="2.5" className="fill-red-300" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ancientRunes)" />
              </svg>
            </div>

            {/* Rock texture overlay */}
            <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent via-slate-700/30 to-slate-900/40" />
          </div>

          {/* Main Content - Just the Title */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.h1 
                className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-wider"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2.5, delay: 0.5 }}
                style={{
                  fontFamily: '"Cinzel", serif',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #dc2626 40%, #ef4444 60%, #1e293b 80%, #0f172a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.8))',
                }}
              >
                WYRMLORE
              </motion.h1>
            </motion.div>
          </div>

          {/* Enhanced Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Fire embers */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`ember-${i}`}
                className="absolute w-2 h-2 bg-gradient-to-t from-red-500 to-orange-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                }}
                animate={{
                  y: [0, -40, -15, -50, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.1, 0.9, 0.3, 1, 0.1],
                  scale: [0.3, 1.5, 0.7, 1.2, 0.3],
                }}
                transition={{
                  duration: 5 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut",
                }}
              />
            ))}
            
            {/* Mystical sparks */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                }}
                animate={{
                  y: [0, -20, -5, -25, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 1, 0.5, 1, 0],
                  scale: [0, 1, 0.5, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Enhanced Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-red-900/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}