"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Clock, User, MessageSquare, Palette, BookOpen, X } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollCard } from "@/components/scroll-card"
import Image from "next/image"
import Link from "next/link"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [recentSearches, setRecentSearches] = useState([
    "Night Fury theories",
    "Hidden World",
    "Toothless fanart",
    "Dragon classes",
  ])

  // Mock search results
  const searchResults = {
    posts: [
      {
        id: 1,
        title: "The Hidden World's Connection to Ancient Dragons",
        content: "I've been analyzing the cave paintings in HTTYD3 and I think there's evidence...",
        author: "DragonLoreKeeper",
        timestamp: "2 hours ago",
        votes: 47,
        comments: 23,
        tags: ["Theory", "Hidden World", "Lore"],
        type: "theory" as const,
      },
      {
        id: 2,
        title: "Discussion: Ranking all dragon classes by combat effectiveness",
        content: "Let's settle this once and for all! I'm creating a tier list of dragon classes...",
        author: "BerkWarrior",
        timestamp: "6 hours ago",
        votes: 34,
        comments: 67,
        tags: ["Discussion", "Dragon Classes", "Combat"],
        type: "discussion" as const,
      },
    ],
    art: [
      {
        id: 1,
        title: "Moonlight Flight",
        artist: "ArtisticRider",
        image: "/placeholder.svg?height=200&width=300",
        likes: 89,
        views: 234,
        tags: ["Night Fury", "Digital Art", "Romantic"],
        description: "Toothless and Light Fury's first flight together",
      },
      {
        id: 2,
        title: "Dragon Rider Portrait",
        artist: "PortraitMaster",
        image: "/placeholder.svg?height=200&width=300",
        likes: 203,
        views: 567,
        tags: ["Portrait", "Hiccup", "Character Art"],
        description: "A detailed portrait of Hiccup in his dragon rider gear",
      },
    ],
    dragons: [
      {
        id: 1,
        name: "Toothless",
        species: "Night Fury",
        class: "Strike Class",
        description: "The last known Night Fury and Hiccup's loyal companion",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Light Fury",
        species: "Light Fury",
        class: "Strike Class",
        description: "A close relative of the Night Fury with unique cloaking abilities",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    users: [
      {
        id: 1,
        username: "DragonLoreKeeper",
        displayName: "The Lore Keeper",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Dedicated to uncovering dragon mysteries",
        followers: 892,
        posts: 156,
        badges: ["Lore Master", "Theory Expert"],
      },
      {
        id: 2,
        username: "ArtisticRider",
        displayName: "Artistic Rider",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Digital artist specializing in dragon art",
        followers: 445,
        posts: 67,
        badges: ["Art Master", "Community Favorite"],
      },
    ],
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches([query.trim(), ...recentSearches.slice(0, 4)])
    }
  }

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(recentSearches.filter((search) => search !== searchToRemove))
  }

  const getResultCount = () => {
    switch (activeTab) {
      case "posts":
        return searchResults.posts.length
      case "art":
        return searchResults.art.length
      case "dragons":
        return searchResults.dragons.length
      case "users":
        return searchResults.users.length
      default:
        return (
          searchResults.posts.length +
          searchResults.art.length +
          searchResults.dragons.length +
          searchResults.users.length
        )
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Search Wyrmlore</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find posts, artwork, dragons, and community members
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search for theories, art, dragons, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchQuery)
                      }
                    }}
                    className="pl-10 h-12 text-lg bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                  />
                </div>
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
                <Button variant="outline" className="h-12 border-amber-200 dark:border-amber-700">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-stone-100">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Badge
                      key={search}
                      className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer pr-1"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-amber-200 dark:hover:bg-amber-800"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeRecentSearch(search)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Found <span className="font-semibold text-amber-600">{getResultCount()}</span> results for "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  All ({getResultCount()})
                </TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Posts ({searchResults.posts.length})
                </TabsTrigger>
                <TabsTrigger value="art" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <Palette className="h-4 w-4 mr-1" />
                  Art ({searchResults.art.length})
                </TabsTrigger>
                <TabsTrigger
                  value="dragons"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Dragons ({searchResults.dragons.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <User className="h-4 w-4 mr-1" />
                  Users ({searchResults.users.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="space-y-8">
                {/* Posts Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Posts</h3>
                  <div className="space-y-4">
                    {searchResults.posts.map((post) => (
                      <ScrollCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>

                {/* Art Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Artwork</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {searchResults.art.map((art) => (
                      <Card
                        key={art.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-0"
                      >
                        <div className="flex gap-4 p-4">
                          <Image
                            src={art.image || "/placeholder.svg"}
                            alt={art.title}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-stone-100 mb-1">{art.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {art.artist}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{art.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{art.likes} likes</span>
                              <span>{art.views} views</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Dragons Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Dragons</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {searchResults.dragons.map((dragon) => (
                      <Link key={dragon.id} href={`/dragons/${dragon.id}`}>
                        <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-0 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <Image
                                src={dragon.image || "/placeholder.svg"}
                                alt={dragon.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-stone-100 mb-1">{dragon.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{dragon.species}</p>
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mb-2">
                                  {dragon.class}
                                </Badge>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{dragon.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Users Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Users</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {searchResults.users.map((user) => (
                      <Link key={user.id} href={`/users/${user.id}`}>
                        <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-0 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                                <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                                  {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-stone-100 mb-1">{user.displayName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">@{user.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.bio}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  <span>{user.followers} followers</span>
                                  <span>{user.posts} posts</span>
                                </div>
                                <div className="flex gap-1">
                                  {user.badges.slice(0, 2).map((badge) => (
                                    <Badge
                                      key={badge}
                                      className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                    >
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Individual Tab Contents */}
              <TabsContent value="posts" className="space-y-4">
                {searchResults.posts.map((post) => (
                  <ScrollCard key={post.id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="art" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.art.map((art) => (
                  <Card
                    key={art.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800"
                  >
                    <Image
                      src={art.image || "/placeholder.svg"}
                      alt={art.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-900 dark:text-stone-100 mb-1">{art.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {art.artist}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{art.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex gap-4">
                          <span>{art.likes} likes</span>
                          <span>{art.views} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="dragons" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.dragons.map((dragon) => (
                  <Link key={dragon.id} href={`/dragons/${dragon.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Image
                          src={dragon.image || "/placeholder.svg"}
                          alt={dragon.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover mx-auto mb-4"
                        />
                        <h4 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-2 font-serif">
                          {dragon.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{dragon.species}</p>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mb-3">
                          {dragon.class}
                        </Badge>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{dragon.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>

              <TabsContent value="users" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.users.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-amber-200 dark:border-amber-700">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xl">
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-1 font-serif">
                          {user.displayName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.bio}</p>
                        <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>{user.followers} followers</span>
                          <span>{user.posts} posts</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {user.badges.map((badge) => (
                            <Badge
                              key={badge}
                              className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* No Results */}
        {searchQuery && getResultCount() === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We couldn't find anything matching "{searchQuery}". Try different keywords or browse our categories.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                  <Link href="/community">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">Browse Community</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
