"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Heart, Share2, MapPin, User, Calendar, Crown, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { DragonService, DragonIndividual } from "@/lib/dragons"

export default function DragonIndividualDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [individual, setIndividual] = useState<DragonIndividual | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const individualId = params.id as string

  useEffect(() => {
    loadIndividual()
  }, [individualId, user])

  const loadIndividual = async () => {
    try {
      const individualData = await DragonService.getDragonIndividualById(individualId, user?.id)
      setIndividual(individualData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!user || !individual) return
    
    try {
      await DragonService.toggleFavorite(user.id, undefined, individual.id)
      setIndividual({
        ...individual,
        is_favorited: !individual.is_favorited
      })
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "alive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "deceased":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "missing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "mate":
        return "💕"
      case "offspring":
        return "👶"
      case "sibling":
        return "👫"
      case "rival":
        return "⚔️"
      case "ally":
        return "🤝"
      case "pack_member":
        return "👥"
      default:
        return "🔗"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dragon...</p>
        </div>
      </div>
    )
  }

  if (error || !individual) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-100 mb-4">Dragon Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "The dragon you're looking for doesn't exist."}</p>
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
                    src={individual.image_url || individual.species.image_url || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"}
                    alt={individual.name}
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
                        individual.is_favorited ? "text-red-500" : "text-gray-400"
                      } hover:text-red-500 bg-white/80 dark:bg-gray-800/80`}
                    >
                      <Heart className={`h-5 w-5 ${individual.is_favorited ? "fill-current" : ""}`} />
                    </Button>
                  )}
                  {individual.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-2 font-serif">
                    {individual.name}
                  </h1>
                  
                  <Link href={`/dragons/species/${individual.species.id}`}>
                    <p className="text-xl text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 cursor-pointer">
                      {individual.species.name}
                    </p>
                  </Link>

                  <div className="flex justify-center gap-3 mb-6">
                    <Badge 
                      className="text-white"
                      style={{ backgroundColor: individual.species.dragon_class.color_code || '#6B7280' }}
                    >
                      {individual.species.dragon_class.name}
                    </Badge>
                    <Badge className={getStatusColor(individual.status)}>
                      {individual.status.charAt(0).toUpperCase() + individual.status.slice(1)}
                    </Badge>
                  </div>

                  {individual.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {individual.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info Card */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                  Dragon Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {individual.gender && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                      <p className="font-semibold text-gray-900 dark:text-stone-100 capitalize flex items-center">
                        <User className="h-4 w-4 mr-1 text-amber-500" />
                        {individual.gender}
                      </p>
                    </div>
                  )}
                  {individual.age_category && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                      <p className="font-semibold text-gray-900 dark:text-stone-100 capitalize flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-amber-500" />
                        {individual.age_category}
                      </p>
                    </div>
                  )}
                  {individual.rider_name && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rider</p>
                      <p className="font-semibold text-gray-900 dark:text-stone-100 flex items-center">
                        <Crown className="h-4 w-4 mr-1 text-amber-500" />
                        {individual.rider_name}
                      </p>
                    </div>
                  )}
                  {individual.location && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-stone-100 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        {individual.location}
                      </p>
                    </div>
                  )}
                </div>

                {individual.first_appearance && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">First Appearance</p>
                    <p className="font-semibold text-gray-900 dark:text-stone-100">
                      {individual.first_appearance}
                    </p>
                  </div>
                )}

                {individual.special_traits && individual.special_traits.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {individual.special_traits.map((trait) => (
                        <Badge key={trait} variant="outline" className="border-amber-200 dark:border-amber-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Relationships and Species Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {/* Relationships */}
            {individual.relationships && individual.relationships.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    <Users className="h-5 w-5 inline-block mr-2" />
                    Dragon Relationships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {individual.relationships.map((relationship) => (
                      <Link key={relationship.id} href={`/dragons/individual/${relationship.related_dragon.id}`}>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage 
                                src={relationship.related_dragon.image_url || relationship.related_dragon.species.image_url || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"} 
                                alt={relationship.related_dragon.name} 
                              />
                              <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                                {relationship.related_dragon.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-stone-100">
                                  {relationship.related_dragon.name}
                                </h4>
                                <Badge className="capitalize">
                                  {getRelationshipIcon(relationship.relationship_type)} {relationship.relationship_type.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {relationship.related_dragon.species.name}
                              </p>
                              {relationship.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                  {relationship.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Species Information */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                  Species Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage 
                      src={individual.species.image_url || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"} 
                      alt={individual.species.name} 
                    />
                    <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                      {individual.species.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/dragons/species/${individual.species.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400">
                        {individual.species.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300">
                      {individual.species.dragon_class.name}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300">
                  {individual.species.description}
                </p>

                {individual.species.abilities && individual.species.abilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-stone-100 mb-2">Key Abilities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {individual.species.abilities.slice(0, 4).map((ability) => (
                        <Badge
                          key={ability.id}
                          variant="outline"
                          className="justify-center py-2 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300"
                        >
                          {ability.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Link href={`/dragons/species/${individual.species.id}`}>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      View Full Species Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}