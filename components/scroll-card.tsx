"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, User, Bookmark, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { VotingSystem } from "./voting-system"
import { CommentSystem } from "./comment-system"

interface Post {
  id: number
  title: string
  content: string
  author: string
  timestamp: string
  votes: number
  comments: number
  tags: string[]
  type: "theory" | "art" | "discussion"
  image?: string
}

interface ScrollCardProps {
  post: Post
}

export function ScrollCard({ post }: ScrollCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theory":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "art":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "discussion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Play sound effect
    if ((window as any).playWyrmSound) {
      ;(window as any).playWyrmSound(isBookmarked ? "bookClose" : "bookOpen", 0.3)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
    // Show toast notification in real app
    console.log("Link copied to clipboard!")
  }

  const mockComments = [
    {
      id: 1,
      author: "BerkWarrior",
      avatar: "/placeholder.svg",
      content: "This is a fascinating theory! I never thought about it that way.",
      timestamp: "1 hour ago",
      votes: 5,
      replies: [],
    },
    {
      id: 2,
      author: "DragonScholar",
      avatar: "/placeholder.svg",
      content: "Have you considered the architectural similarities to real-world ancient civilizations?",
      timestamp: "45 minutes ago",
      votes: 3,
      replies: [
        {
          id: 3,
          author: post.author,
          avatar: "/placeholder.svg",
          content: "Great point! I actually have some research on that topic I can share.",
          timestamp: "30 minutes ago",
          votes: 2,
          isReply: true,
        },
      ],
    },
  ]

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-amber-50 via-stone-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 relative">
        {/* Decorative border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(post.type)}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                  <Clock className="h-4 w-4 ml-3 mr-1" />
                  {post.timestamp}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors">
                {post.title}
              </h3>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {post.image && (
              <div className="flex-shrink-0">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt="Post image"
                  width={150}
                  height={100}
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-amber-100 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <VotingSystem
                postId={post.id}
                initialVotes={post.votes}
                onVote={(postId, voteType) => {
                  console.log(`Voted ${voteType} on post ${postId}`)
                }}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowComments(!showComments)
                  if ((window as any).playWyrmSound) {
                    ;(window as any).playWyrmSound("pageFlip", 0.2)
                  }
                }}
                className="h-8 px-3 hover:bg-amber-100 dark:hover:bg-amber-900/20"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`h-8 px-3 hover:bg-amber-100 dark:hover:bg-amber-900/20 ${
                  isBookmarked ? "text-amber-600 dark:text-amber-400" : ""
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 px-3 hover:bg-amber-100 dark:hover:bg-amber-900/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
            >
              Read More
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-amber-100 dark:border-gray-600"
            >
              <CommentSystem
                postId={post.id}
                comments={mockComments}
                onAddComment={(postId, content, parentId) => {
                  console.log(`Added comment to post ${postId}:`, content, parentId)
                }}
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
