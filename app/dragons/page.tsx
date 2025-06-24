"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function DragonCodexPage() {
  const [currentDragon, setCurrentDragon] = useState(0)
  const [isBookOpen, setIsBookOpen] = useState(false)

  const dragons = [
    {
      id: 1,
      name: "Toothless",
      species: "Night Fury",
      class: "Strike Class",
      rarity: "Legendary",
      abilities: ["Plasma Blasts", "Stealth Mode", "Echolocation", "Alpha Command"],
      stats: { firepower: 10, speed: 10, armor: 8, stealth: 10, venom: 0, jawStrength: 6 },
      description:
        "The last known Night Fury, Toothless is Hiccup's loyal companion and the Alpha of all dragons. His intelligence and bond with humans makes him truly unique among dragonkind.",
      lore: "Once thought extinct, Night Furies were the most feared dragons in the archipelago. Toothless proved that with understanding and friendship, even the most dangerous dragons can become the most loyal companions.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Light Fury",
      species: "Light Fury",
      class: "Strike Class",
      rarity: "Legendary",
      abilities: ["Plasma Blasts", "Cloaking", "Heat Camouflage", "Hypersonic Speed"],
      stats: { firepower: 9, speed: 10, armor: 7, stealth: 10, venom: 0, jawStrength: 6 },
      description:
        "A close relative of the Night Fury, the Light Fury is equally elusive and powerful. Her white scales shimmer with an otherworldly beauty, and she possesses unique cloaking abilities.",
      lore: "Light Furies are the guardians of the Hidden World, using their cloaking abilities to remain unseen by humans. They represent the wild, untamed spirit of dragonkind.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
      name: "Stormfly",
      species: "Deadly Nadder",
      class: "Tracker Class",
      rarity: "Common",
      abilities: ["Spine Shot", "Magnesium Fire", "Keen Eyesight", "Tail Spikes"],
      stats: { firepower: 8, speed: 8, armor: 6, stealth: 4, venom: 0, jawStrength: 5 },
      description:
        "Astrid's faithful companion, Stormfly is a Deadly Nadder known for her precision and loyalty. Her colorful plumage and deadly accuracy make her a formidable ally.",
      lore: "Deadly Nadders are among the most beautiful dragons, but their beauty hides a deadly arsenal. Their tail spikes can be launched with pinpoint accuracy.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 4,
      name: "Hookfang",
      species: "Monstrous Nightmare",
      class: "Stoker Class",
      rarity: "Common",
      abilities: ["Body Ignition", "Kerosene Gel Fire", "Wing Flame", "Intimidation"],
      stats: { firepower: 10, speed: 6, armor: 8, stealth: 2, venom: 0, jawStrength: 8 },
      description:
        "Snotlout's temperamental dragon, Hookfang is a Monstrous Nightmare with a fiery personality to match his flaming abilities. He can set his entire body ablaze.",
      lore: "Monstrous Nightmares are the most aggressive of the dragon species, known for their ability to set themselves on fire and their stubborn, prideful nature.",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  const dragon = dragons[currentDragon]

  const nextDragon = () => {
    setCurrentDragon((prev) => (prev + 1) % dragons.length)
  }

  const prevDragon = () => {
    setCurrentDragon((prev) => (prev - 1 + dragons.length) % dragons.length)
  }

  const getStatColor = (value: number) => {
    if (value >= 9) return "bg-red-500"
    if (value >= 7) return "bg-orange-500"
    if (value >= 5) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Common":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
            Dragon Codex
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">The complete encyclopedia of dragonkind</p>
        </motion.div>

        {/* Book Interface */}
        <div className="relative">
          {!isBookOpen ? (
            /* Closed Book */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <Card
                className="w-96 h-64 bg-gradient-to-br from-amber-800 to-amber-900 border-4 border-amber-700 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setIsBookOpen(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
                  <BookOpen className="h-16 w-16 text-amber-200 mb-4" />
                  <h2 className="text-2xl font-bold text-amber-100 mb-2 font-serif">Dragon Codex</h2>
                  <p className="text-amber-200 text-sm">Click to open the ancient tome</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Open Book */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Left Page - Dragon Image */}
              <Card className="bg-gradient-to-br from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-200 dark:border-amber-700 shadow-xl">
                <CardContent className="p-8">
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={dragon.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={dragon.image || "/placeholder.svg"}
                          alt={dragon.name}
                          width={400}
                          height={400}
                          className="w-full h-80 object-cover rounded-lg shadow-lg"
                        />

                        <div className="mt-6 text-center">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-stone-100 mb-2 font-serif">
                            {dragon.name}
                          </h2>
                          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{dragon.species}</p>
                          <div className="flex justify-center gap-2">
                            <Badge className="bg-amber-500 text-white">{dragon.class}</Badge>
                            <Badge className={getRarityColor(dragon.rarity)}>{dragon.rarity}</Badge>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Right Page - Dragon Details */}
              <Card className="bg-gradient-to-br from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-200 dark:border-amber-700 shadow-xl">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dragon.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Description */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif">
                          Description
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{dragon.description}</p>
                      </div>

                      {/* Abilities */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif">
                          Abilities
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {dragon.abilities.map((ability) => (
                            <Badge
                              key={ability}
                              variant="outline"
                              className="justify-center py-2 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300"
                            >
                              {ability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif">
                          Combat Stats
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(dragon.stats).map(([stat, value]) => (
                            <div key={stat} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {stat.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${getStatColor(value)}`}
                                    style={{ width: `${(value / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-stone-100 w-6">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lore */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif">Lore</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{dragon.lore}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation Controls */}
          {isBookOpen && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <Button
                variant="outline"
                onClick={prevDragon}
                className="bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {dragons.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDragon(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentDragon
                        ? "bg-amber-500 scale-125"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-amber-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextDragon}
                className="bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Close Book Button */}
          {isBookOpen && (
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={() => setIsBookOpen(false)}
                className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
              >
                Close Codex
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
