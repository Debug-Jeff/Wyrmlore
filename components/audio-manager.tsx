"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music } from "lucide-react"
import { motion } from "framer-motion"

interface AudioManagerProps {
  enableAmbient?: boolean
  enableSFX?: boolean
}

export function AudioManager({ enableAmbient = true, enableSFX = true }: AudioManagerProps) {
  const [isAmbientEnabled, setIsAmbientEnabled] = useState(enableAmbient)
  const [isSFXEnabled, setIsSFXEnabled] = useState(enableSFX)
  const [isPlaying, setIsPlaying] = useState(false)

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null)
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null)

  // Sound effect library
  const sounds = {
    dragonRoar: "/sounds/dragon-roar.mp3",
    pageFlip: "/sounds/page-flip.mp3",
    leatherCreak: "/sounds/leather-creak.mp3",
    bookOpen: "/sounds/book-open.mp3",
    bookClose: "/sounds/book-close.mp3",
    dragonChirp: "/sounds/dragon-chirp.mp3",
    upvote: "/sounds/upvote.mp3",
    downvote: "/sounds/downvote.mp3",
    notification: "/sounds/notification.mp3",
    ambient: "/sounds/cave-ambient.mp3",
  }

  useEffect(() => {
    // Initialize ambient audio
    if (isAmbientEnabled) {
      ambientAudioRef.current = new Audio(sounds.ambient)
      ambientAudioRef.current.loop = true
      ambientAudioRef.current.volume = 0.3
    }

    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause()
        ambientAudioRef.current = null
      }
    }
  }, [isAmbientEnabled])

  const playSound = (soundName: keyof typeof sounds, volume = 0.5) => {
    if (!isSFXEnabled && soundName !== "ambient") return

    try {
      const audio = new Audio(sounds[soundName])
      audio.volume = volume
      audio.play().catch(console.error)
    } catch (error) {
      console.log(`Sound ${soundName} not available:`, error)
    }
  }

  const toggleAmbient = () => {
    if (isAmbientEnabled && ambientAudioRef.current) {
      if (isPlaying) {
        ambientAudioRef.current.pause()
        setIsPlaying(false)
      } else {
        ambientAudioRef.current.play().catch(console.error)
        setIsPlaying(true)
      }
    }
  }

  const toggleSFX = () => {
    setIsSFXEnabled(!isSFXEnabled)
    if (!isSFXEnabled) {
      playSound("dragonChirp", 0.3) // Test sound
    }
  }

  // Expose playSound function globally for other components
  useEffect(() => {
    ;(window as any).playWyrmSound = playSound
  }, [isSFXEnabled])

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      {/* Ambient Sound Toggle */}
      {isAmbientEnabled && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAmbient}
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
              isPlaying ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Music className="h-4 w-4 mr-2" />
            {isPlaying ? "Ambient On" : "Ambient Off"}
          </Button>
        </motion.div>
      )}

      {/* SFX Toggle */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSFX}
          className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
            isSFXEnabled ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {isSFXEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
          {isSFXEnabled ? "SFX On" : "SFX Off"}
        </Button>
      </motion.div>

      {/* Sound visualizer */}
      {isPlaying && (
        <motion.div
          className="flex items-center gap-1 px-3 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-amber-500 rounded-full"
              animate={{
                height: [4, 12, 4],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
