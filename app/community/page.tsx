"use client"

import { useState, useEffect } from "react"
import { ScrollCard } from "@/components/scroll-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, TrendingUp, Clock, Star, Users, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { PostService, Post } from "@/lib/posts"

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("hot")

  useEffect(() => {
    loadPosts()
  }, [activeFilter, user])

  const loadPosts = async () => {
    try {
      const postsData = await PostService.getPosts({
        page: 1,
        limit: 10,
        userId: user?.id
      })
      setPosts(postsData)
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setLoading(false)
    }
  }


  const filterTabs = [
    { label: "Hot", icon: TrendingUp, value: "hot" },
    { label: "New", icon: Clock, value: "new" },
    { label: "Top", icon: Star, value: "top" },
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
              {user ? (
                <Link href="/create">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Post
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Join to Create Posts
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.label}
                  variant={activeFilter === tab.value ? "default" : "ghost"}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`flex-1 ${
                    activeFilter === tab.value
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
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ScrollCard post={post} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-stone-100 mb-2">No posts yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Be the first to share something with the community!</p>
                  {user ? (
                    <Link href="/create">
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/register">
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        Join to Post
                      </Button>
                    </Link>
                  )}
                </div>
              )}
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
