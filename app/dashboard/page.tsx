"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Settings,
  Heart,
  MessageSquare,
  Palette,
  ScrollText,
  Trophy,
  Calendar,
  TrendingUp,
  Edit3,
  Upload,
} from "lucide-react"
import { motion } from "framer-motion"
import { ScrollCard } from "@/components/scroll-card"
import { useAuth } from "@/contexts/auth-context"
import { PostService } from "@/lib/posts"
import { DragonService } from "@/lib/dragons"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoriteDragons, setFavoriteDragons] = useState({
    species: [],
    individuals: []
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    loadUserData()
  }, [user, router])

  const loadUserData = async () => {
    try {
      const [posts, favorites] = await Promise.all([
        PostService.getPosts({ author: user?.profile?.username, userId: user?.id }),
        DragonService.getUserFavorites(user!.id)
      ])
      
      setUserPosts(posts)
      setFavoriteDragons(favorites)
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const achievements = [
    { name: "First Post", description: "Created your first community post", earned: true },
    { name: "Art Enthusiast", description: "Uploaded 5 artworks", earned: true },
    { name: "Theory Crafter", description: "Posted 10 theories", earned: false },
    { name: "Community Leader", description: "Received 100 upvotes", earned: true },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-amber-200 dark:border-amber-700">
              <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} alt={user.profile?.username || "User"} />
              <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-2xl font-bold">
                {(user.profile?.display_name || user.profile?.username || user.email).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                  {user.profile?.display_name || user.profile?.username || "Dragon Rider"}
                </h1>
                <Badge className="bg-amber-500 text-white">Member</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{user.profile?.bio || "No bio yet"}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.profile?.created_at || Date.now()).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {userPosts.length} posts
                </div>
              </div>
            </div>

            <Link href="/profile">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
            <CardContent className="p-4 text-center">
              <ScrollText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">{userPosts.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Posts</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
            <CardContent className="p-4 text-center">
              <Palette className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">
                {favoriteDragons.species.length + favoriteDragons.individuals.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Favorite Dragons</div>
            </CardContent>
          </Card>

          {/* Additional stat cards can be added here */}
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                My Posts
              </TabsTrigger>
              <TabsTrigger value="art" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                My Art
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Saved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                        Create Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Link href="/posts/create">
                          <Button className="h-16 w-full bg-blue-500 hover:bg-blue-600 text-white flex-col">
                            <Edit3 className="h-6 w-6 mb-1" />
                            Create Post
                          </Button>
                        </Link>
                        <Link href="/dragons">
                          <Button className="h-16 w-full bg-purple-500 hover:bg-purple-600 text-white flex-col">
                            <BookOpen className="h-6 w-6 mb-1" />
                            Explore Dragons
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
                            </div>
                          ))}
                        </div>
                      ) : userPosts.length > 0 ? (
                        userPosts.slice(0, 2).map((post) => (
                          <ScrollCard key={post.id} post={post} />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
                          <Link href="/posts/create">
                            <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                              Create Your First Post
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Badges */}
                  <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-stone-100 font-serif flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-amber-600" />
                        Badges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge className="w-full justify-center py-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Dragon Enthusiast
                        </Badge>
                        {userPosts.length > 0 && (
                          <Badge className="w-full justify-center py-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Content Creator
                          </Badge>
                        )}
                        {favoriteDragons.species.length + favoriteDragons.individuals.length > 5 && (
                          <Badge className="w-full justify-center py-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Dragon Collector
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-stone-100 font-serif flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.name}
                            className={`p-3 rounded-lg border ${
                              achievement.earned
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                                : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4
                                className={`font-semibold ${
                                  achievement.earned
                                    ? "text-green-800 dark:text-green-200"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {achievement.name}
                              </h4>
                              {achievement.earned && <Trophy className="h-4 w-4 text-amber-500" />}
                            </div>
                            <p
                              className={`text-sm ${
                                achievement.earned
                                  ? "text-green-600 dark:text-green-300"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {achievement.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="posts">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    My Posts ({user.stats.posts})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts
                    .filter((post) => post.type !== "art")
                    .map((post) => (
                      <ScrollCard key={post.id} post={post} />
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="art">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    My Artwork ({user.stats.artworks})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts
                    .filter((post) => post.type === "art")
                    .map((post) => (
                      <ScrollCard key={post.id} post={post} />
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Saved Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No saved content yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Save posts and artwork to view them here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
