"use client"

import { ScrollCard } from "@/components/scroll-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, TrendingUp, Clock, Star, Users, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      title: "Theory: The Hidden World's Connection to Ancient Dragons",
      content:
        "I've been analyzing the cave paintings in HTTYD3 and I think there's evidence that the Hidden World existed long before Toothless discovered it. The symbols suggest a complex civilization of dragons that predates human contact by thousands of years. What do you all think?",
      author: "DragonLoreKeeper",
      timestamp: "2 hours ago",
      votes: 47,
      comments: 23,
      tags: ["Theory", "Hidden World", "Lore"],
      type: "theory" as const,
    },
    {
      id: 2,
      title: "My latest Night Fury artwork - 'Moonlight Flight'",
      content:
        "Spent the weekend working on this piece inspired by Toothless and the Light Fury's first flight together. Used digital painting techniques to capture the ethereal glow of their bond. Hope you enjoy!",
      author: "ArtisticRider",
      timestamp: "4 hours ago",
      votes: 89,
      comments: 15,
      tags: ["Fanart", "Night Fury", "Digital Art"],
      type: "art" as const,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Discussion: Ranking all dragon classes by combat effectiveness",
      content:
        "Let's settle this once and for all! I'm creating a tier list of dragon classes based on their combat abilities. Starting with Strike Class at the top, but I want to hear your thoughts on where each class should rank.",
      author: "BerkWarrior",
      timestamp: "6 hours ago",
      votes: 34,
      comments: 67,
      tags: ["Discussion", "Dragon Classes", "Combat"],
      type: "discussion" as const,
    },
    {
      id: 4,
      title: "Found this amazing detail in HTTYD2 - Valka's dragon sanctuary",
      content:
        "Rewatching HTTYD2 and noticed something incredible in Valka's sanctuary scene. The way the dragons organize themselves mirrors real-world animal behavior patterns. The attention to detail is phenomenal!",
      author: "DetailHunter",
      timestamp: "8 hours ago",
      votes: 56,
      comments: 31,
      tags: ["Movies", "Details", "Analysis"],
      type: "discussion" as const,
    },
  ]

  const filterTabs = [
    { label: "Hot", icon: TrendingUp, active: true },
    { label: "New", icon: Clock, active: false },
    { label: "Top", icon: Star, active: false },
  ]

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                Community Scrolls
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Share theories, discuss lore, and connect with fellow dragon riders
              </p>
            </div>

            {/* Create Post Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Post
              </Button>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.label}
                  variant={tab.active ? "default" : "ghost"}
                  className={`flex-1 ${
                    tab.active
                      ? "bg-amber-500 text-white shadow-md"
                      : "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ScrollCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rune Ledger Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Community Stats */}
              <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Dragon Riders</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-stone-100">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Active Discussions</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-stone-100">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Posts Today</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-stone-100">47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Theory", "Fanart", "Discussion", "Movies", "TV Series", "Dragons", "Lore", "Analysis"].map(
                      (tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                        >
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                    Community Guidelines
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Be respectful to all dragon riders</li>
                    <li>• Keep content family-friendly</li>
                    <li>• Credit original artists</li>
                    <li>• Use spoiler tags appropriately</li>
                    <li>• Stay on topic about HTTYD</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
