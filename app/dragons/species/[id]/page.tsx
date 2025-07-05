"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Heart, Share2, MapPin, Zap, Shield, Eye, Skull, Flame, Grip } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { DragonService, DragonSpecies } from "@/lib/dragons"

export default function DragonSpeciesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [species, setSpecies] = useState<DragonSpecies | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const speciesId = params.id as string

  useEffect(() => {
    loadSpecies()
  }, [speciesId, user])

  const loadSpecies = async () => {
    try {
      const speciesData = await DragonService.getDragonSpeciesById(speciesId, user?.id)
      setSpecies(speciesData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!user || !species) return
    
    try {
      await DragonService.toggleFavorite(user.id, species.id)
      setSpecies({
        ...species,
        is_favorited: !species.is_favorited
      })
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error)
    }
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

  const getAbilityIcon = (type: string) => {
    switch (type) {
      case "breath_weapon":
        return <Flame className="h-4 w-4" />
      case "physical":
        return <Grip className="h-4 w-4" />
      case "magical":
        return <Zap className="h-4 w-4" />
      case "special":
        return <Eye className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dragon species...</p>
        </div>
      </div>
    )
  }

  if (error || !species) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-100 mb-4">Species Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "The dragon species you're looking for doesn't exist."}</p>
          <Link href="/dragons">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dragon Codex
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link href="/dragons">
            <Button variant="ghost" className="hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dragon Codex
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl mb-6">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <Image
                    src={species.image_url || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"}
                    alt={species.name}
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavorite}
                      className={`absolute top-4 right-4 ${
                        species.is_favorited ? "text-red-500" : "text-gray-400"
                      } hover:text-red-500 bg-white/80 dark:bg-gray-800/80`}
                    >
                      <Heart className={`h-5 w-5 ${species.is_favorited ? "fill-current" : ""}`} />
                    </Button>
                  )}
                </div>

                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                    {species.name}
                  </h1>
                  
                  <div className="flex justify-center gap-3 mb-6">
                    <Badge 
                      className="text-white text-lg px-4 py-2"
                      style={{ backgroundColor: species.dragon_class.color_code || '#6B7280' }}
                    >
                      {species.dragon_class.name}
                    </Badge>
                    <Badge className={`${getRarityColor(species.rarity)} text-lg px-4 py-2`}>
                      {species.rarity.charAt(0).toUpperCase() + species.rarity.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {species.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info Card */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Size Category</p>
                    <p className="font-semibold text-gray-900 dark:text-stone-100 capitalize">
                      {species.size_category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Intelligence</p>
                    <p className="font-semibold text-gray-900 dark:text-stone-100 capitalize">
                      {species.intelligence_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Diet</p>
                    <p className="font-semibold text-gray-900 dark:text-stone-100">
                      {species.diet}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temperament</p>
                    <p className="font-semibold text-gray-900 dark:text-stone-100">
                      {species.temperament}
                    </p>
                  </div>
                </div>

                {species.habitat && species.habitat.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Habitat</p>
                    <div className="flex flex-wrap gap-2">
                      {species.habitat.map((habitat) => (
                        <Badge key={habitat} variant="outline" className="capitalize">
                          <MapPin className="h-3 w-3 mr-1" />
                          {habitat.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {/* Abilities */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                  Abilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {species.abilities.map((ability) => (
                    <div key={ability.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getAbilityIcon(ability.ability_type)}
                          <h4 className="font-semibold text-gray-900 dark:text-stone-100">
                            {ability.name}
                          </h4>
                        </div>
                        {ability.power_level && (
                          <Badge className={`${getStatColor(ability.power_level)} text-white`}>
                            Power: {ability.power_level}/10
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {ability.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Combat Stats */}
            {species.stats && (
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Combat Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'firepower', label: 'Firepower', icon: Flame },
                      { key: 'speed', label: 'Speed', icon: Zap },
                      { key: 'armor', label: 'Armor', icon: Shield },
                      { key: 'stealth', label: 'Stealth', icon: Eye },
                      { key: 'venom', label: 'Venom', icon: Skull },
                      { key: 'jaw_strength', label: 'Jaw Strength', icon: Grip },
                    ].map(({ key, label, icon: Icon }) => {
                      const value = species.stats?.[key as keyof typeof species.stats] || 0
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getStatColor(value)}`}
                                style={{ width: `${(value / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-stone-100 w-6">
                              {value}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Physical Stats */}
                  {(species.stats.wing_span_meters || species.stats.length_meters || species.stats.weight_kg) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-stone-100 mb-3">Physical Measurements</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {species.stats.wing_span_meters && (
                          <div>
                            <p className="text-2xl font-bold text-amber-600">{species.stats.wing_span_meters}m</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wingspan</p>
                          </div>
                        )}
                        {species.stats.length_meters && (
                          <div>
                            <p className="text-2xl font-bold text-amber-600">{species.stats.length_meters}m</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Length</p>
                          </div>
                        )}
                        {species.stats.weight_kg && (
                          <div>
                            <p className="text-2xl font-bold text-amber-600">{species.stats.weight_kg}kg</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lore */}
            {species.lore && (
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Dragon Lore
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {species.lore}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}