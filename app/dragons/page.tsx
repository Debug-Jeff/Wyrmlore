"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, BookOpen, Search, Filter, Heart, Star, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { DragonService, DragonSpecies, DragonIndividual, DragonClass } from "@/lib/dragons"

export default function DragonCodexPage() {
  const { user } = useAuth()
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("species")
  const [species, setSpecies] = useState<DragonSpecies[]>([])
  const [individuals, setIndividuals] = useState<DragonIndividual[]>([])
  const [classes, setClasses] = useState<DragonClass[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedRarity, setSelectedRarity] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    filterData()
  }, [searchTerm, selectedClass, selectedRarity, activeTab])

  const loadData = async () => {
    try {
      const [speciesData, individualsData, classesData] = await Promise.all([
        DragonService.getDragonSpecies({ userId: user?.id }),
        DragonService.getDragonIndividuals({ userId: user?.id }),
        DragonService.getDragonClasses()
      ])
      
      setSpecies(speciesData)
      setIndividuals(individualsData)
      setClasses(classesData)
    } catch (error) {
      console.error("Failed to load dragon data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterData = async () => {
    try {
      if (activeTab === "species") {
        const filtered = await DragonService.getDragonSpecies({
          search: searchTerm,
          classId: selectedClass,
          rarity: selectedRarity,
          userId: user?.id
        })
        setSpecies(filtered)
      } else {
        const filtered = await DragonService.getDragonIndividuals({
          search: searchTerm,
          userId: user?.id
        })
        setIndividuals(filtered)
      }
    } catch (error) {
      console.error("Failed to filter data:", error)
    }
  }

  const handleFavorite = async (speciesId?: string, individualId?: string) => {
    if (!user) return
    
    try {
      await DragonService.toggleFavorite(user.id, speciesId, individualId)
      // Reload data to update favorite status
      if (activeTab === "species") {
        filterData()
      } else {
        filterData()
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const getCurrentItems = () => {
    const items = activeTab === "species" ? species : individuals
    const startIndex = currentPage * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = () => {
    const items = activeTab === "species" ? species : individuals
    return Math.ceil(items.length / itemsPerPage)
  }

  const nextPage = () => {
    const totalPages = getTotalPages()
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    const totalPages = getTotalPages()
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const getStatColor = (value: number) => {
    if (value >= 9) return "bg-red-500"
    if (value >= 7) return "bg-orange-500"
    if (value >= 5) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "uncommon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "common":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "mythical":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Dragon Codex...</p>
        </div>
      </div>
    )
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
          /* Open Book - Dragon Database */
                      </motion.div>
                    </AnimatePresence>
                  </div>
            className="space-y-8"
              </Card>
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
            {/* Search and Filters */}
            <Card className="bg-gradient-to-br from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-200 dark:border-amber-700 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search dragons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700"
                    />
                  </div>
                  
                  {activeTab === "species" && (
                    <>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Classes</SelectItem>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                        <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700">
                          <SelectValue placeholder="All Rarities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Rarities</SelectItem>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="uncommon">Uncommon</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="legendary">Legendary</SelectItem>
                          <SelectItem value="mythical">Mythical</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
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
