"use client"

import { useEffect, useState } from "react"
import { Hero } from "@/components/hero"
import { FeaturesPreview } from "@/components/features-preview"
import { RecentActivity } from "@/components/recent-activity"
import { Footer } from "@/components/footer"
import { DragonCompanion } from "@/components/dragon-companion"

export default function HomePage() {
  const [showCover, setShowCover] = useState(true)

  useEffect(() => {
    // Check if user has seen cover page before
    const hasSeenCover = localStorage.getItem("hasSeenCover")
    if (hasSeenCover) {
      setShowCover(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <Hero />
      <FeaturesPreview />
      <RecentActivity />
      <Footer />
      <DragonCompanion />
    </div>
  )
}
