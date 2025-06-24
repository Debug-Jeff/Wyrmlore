"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, MessageCircle, Flag, Calendar, MapPin, LinkIcon } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollCard } from "@/components/scroll-card"

interface UserProfilePageProps {
  params: {
    userId: string
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // Mock user data - in real app, fetch based on params.userId
  const user = {
    id: params.userId,
    username: "DragonLoreKeeper",
    displayName: "The Lore Keeper",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "Dedicated to uncovering the mysteries of dragon lore and the Hidden World. HTTYD enthusiast since 2010!",
    location: "Berk",
    website: "dragonlore.com",
    joinDate: "January 2024",
    role: "Moderator",
    isVerified: true,
    stats: {
      posts: 156,
      artworks: 23,
      likes: 2847,
      comments: 456,
      followers: 892,
      following: 234,
    },
    badges: ["Lore Master", "Theory Expert", "Community Moderator", "Dragon Scholar"],
  }

  const userPosts = [
    {
      id: 1,
      title: "The Hidden World's Ancient Civilization Theory",
      content:
        "After extensive research into the cave paintings and architectural elements shown in HTTYD3, I believe the Hidden World was once home to an advanced dragon civilization...",
      author: "DragonLoreKeeper",
      timestamp: "3 hours ago",
      votes: 89,
      comments: 34,
      tags: ["Theory", "Hidden World", "Ancient Dragons"],
      type: "theory" as const,
    },
    {
      id: 2,
      title: "Complete Dragon Class Analysis - Updated 2024",
      content:
        "I've compiled a comprehensive analysis of all known dragon classes, their evolutionary relationships, and behavioral patterns. This includes new insights from the latest content...",
      author: "DragonLoreKeeper",
      timestamp: "1 day ago",
      votes: 156,
      comments: 67,
      tags: ["Analysis", "Dragon Classes", "Lore"],
      type: "discussion" as const,
    },
    {
      id: 3,
      title: "Night Fury Evolution Timeline",
      content:
        "Based on archaeological evidence and behavioral studies, here's my theory on how Night Furies evolved to become the apex predators of the dragon world...",
      author: "DragonLoreKeeper",
      timestamp: "3 days ago",
      votes: 203,
      comments: 89,
      tags: ["Theory", "Night Fury", "Evolution"],
      type: "theory" as const,
    },
  ]

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-amber-200 dark:border-amber-700">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-3xl font-bold">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                      {user.displayName}
                    </h1>
                    <Badge className="bg-purple-500 text-white">{user.role}</Badge>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">@{user.username}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{user.bio}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href={`https://${user.website}`} className="text-amber-600 hover:text-amber-700">
                        {user.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.joinDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm mb-6">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-stone-100">{user.stats.following}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-stone-100">{user.stats.followers}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleFollow}
                      className={`${
                        isFollowing
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" className="border-amber-200 dark:border-amber-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-600">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">{user.stats.posts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Posts</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">{user.stats.artworks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Artworks</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">{user.stats.likes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Likes</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">{user.stats.comments}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Comments</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-stone-100 font-serif">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700">
              <TabsTrigger value="posts" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Posts ({user.stats.posts})
              </TabsTrigger>
              <TabsTrigger value="art" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Art ({user.stats.artworks})
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Comments ({user.stats.comments})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {userPosts.map((post) => (
                <ScrollCard key={post.id} post={post} />
              ))}
            </TabsContent>

            <TabsContent value="art">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="mb-2">No artwork shared yet</p>
                    <p className="text-sm">Check back later for amazing dragon art!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="mb-2">Recent comments will appear here</p>
                    <p className="text-sm">This user is actively engaging with the community!</p>
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
