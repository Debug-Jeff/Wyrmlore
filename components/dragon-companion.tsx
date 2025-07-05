"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function DragonCompanion() {
  const [isVisible, setIsVisible] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "Welcome to Wyrmlore, young rider! 🐉",
    "Need help navigating? I'm here to guide you!",
    "Don't forget to check out the Dragon Codex!",
    "The community is buzzing with new theories!",
    "Remember to save your favorite posts!",
  ]

  useEffect(() => {
    // Show companion after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Cycle through messages
    if (showMessage) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [showMessage, messages.length])

  const playSound = (soundType: string) => {
    // In a real app, you'd play actual sound files here
    console.log(`Playing ${soundType} sound`)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Message Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-20 right-0 mb-4 mr-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-xs border-2 border-amber-200 dark:border-amber-700">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 pr-2">{messages[currentMessage]}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMessage(false)}
                      className="h-6 w-6 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute bottom-0 right-8 transform translate-y-full">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dragon Companion */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            <Button
              onClick={() => {
                setShowMessage(!showMessage)
                playSound("dragonChirp")
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110 border-2 border-amber-300"
            >
              {/* Dragon SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-white">
                {/* Dragon silhouette */}
                <path
                  d="M16 4c-2 0-4 1-5 3-1 1-1 3 0 4l1 1c0 1-1 2-2 2s-2-1-2-2c0-1 1-2 2-2h1c-1-2-1-4 1-6 2-2 5-2 7 0s2 4 1 6h1c1 0 2 1 2 2s-1 2-2 2-2-1-2-2l1-1c1-1 1-3 0-4-1-2-3-3-5-3z"
                  fill="currentColor"
                />
                {/* Dragon eyes */}
                <circle cx="13" cy="8" r="1" fill="#F59E0B" />
                <circle cx="19" cy="8" r="1" fill="#F59E0B" />
                {/* Dragon body */}
                <ellipse cx="16" cy="16" rx="8" ry="6" fill="currentColor" opacity="0.8" />
                {/* Dragon tail */}
                <path d="M24 16c2 2 2 6 0 8-1 1-3 1-4 0l4-8z" fill="currentColor" opacity="0.6" />
                {/* Dragon wings */}
                <path d="M8 12c-2-1-4 0-4 2s2 3 4 2l-0-4z" fill="currentColor" opacity="0.7" />
                <path d="M24 12c2-1 4 0 4 2s-2 3-4 2l0-4z" fill="currentColor" opacity="0.7" />
              </svg>
            </Button>

            {/* Floating particles around dragon */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-400 opacity-20 -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.div>

          {/* Notification badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
