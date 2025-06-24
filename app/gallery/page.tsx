"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Eye, Search, Filter, Upload, Grid, List } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const artworks = [
    {
      id: 1,
      title: "Moonlight Flight",
      artist: "ArtisticRider",
      image: "/placeholder.svg?height=300&width=400",
      likes: 89,
      views: 234,
      tags: ["Night Fury", "Digital Art", "Romantic"],
      medium: "Digital Painting",
      description: "Toothless and Light Fury's first flight together under the moonlight",
    },
    {
      id: 2,
      title: "Berk Sunrise",
      artist: "VikingArtist",
      image: "/placeholder.svg?height=400&width=300",
      likes: 156,
      views: 445,
      tags: ["Landscape", "Berk", "Traditional"],
      medium: "Watercolor",
      description: "The village of Berk awakening to a new day with dragons soaring overhead",
    },
    {
      id: 3,
      title: "Dragon Rider Portrait",
      artist: "PortraitMaster",
      image: "/placeholder.svg?height=350&width=350",
      likes: 203,
      views: 567,
      tags: ["Portrait", "Hiccup", "Character Art"],
      medium: "Oil Painting",
      description: "A detailed portrait of Hiccup in his dragon rider gear",
    },
    {
      id: 4,
      title: "Stormfly in Action",
      artist: "ActionArtist",
      image: "/placeholder.svg?height=280&width=420",
      likes: 134,
      views: 389,
      tags: ["Deadly Nadder", "Action", "Digital Art"],
      medium: "Digital Illustration",
      description: "Stormfly launching her signature spine attack in dynamic motion",
    },
    {
      id: 5,
      title: "Hidden World Entrance",
      artist: "EnvironmentPro",
      image: "/placeholder.svg?height=320&width=480",
      likes: 267,
      views: 678,
      tags: ["Environment", "Hidden World", "Concept Art"],
      medium: "Digital Matte Painting",
      description: "The mystical entrance to the Hidden World with glowing crystals",
    },
    {
      id: 6,
      title: "Baby Dragon Collection",
      artist: "CuteCreator",
      image: "/placeholder.svg?height=250&width=350",
      likes: 445,
      views: 892,
      tags: ["Baby Dragons", "Cute", "Character Design"],
      medium: "Digital Art",
      description: "Adorable baby versions of all the main dragons from the series",
    },
  ]

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
            Fanart Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover incredible dragon artwork from talented artists worldwide
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search artworks, artists, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700 focus:border-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>

            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Art
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800 group">
                <div className="relative overflow-hidden">
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-stone-100 mb-2 font-serif">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {artwork.artist}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{artwork.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {artwork.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {artwork.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {artwork.views}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {artwork.medium}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            Load More Artwork
          </Button>
        </div>
      </div>
    </div>
  )
}
