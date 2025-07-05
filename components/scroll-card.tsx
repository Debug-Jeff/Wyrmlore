"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, User, Bookmark, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { PostService } from "@/lib/posts"
import { VotingSystem } from "./voting-system"
import { CommentSystem } from "./comment-system"

import { Post } from "@/lib/posts"

interface ScrollCardProps {
  post: Post
}

export function ScrollCard({ post }: ScrollCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)

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

  const handleVote = async (postId: number, voteType: "up" | "down" | null) => {
    if (!user) return
    
    try {
      const result = await PostService.votePost(postId.toString(), user.id, voteType)
      setCurrentPost({
        ...currentPost,
        votes: result.totalVotes,
        user_vote: result.userVote
      })
    } catch (error: any) {
      console.error("Failed to vote:", error)
    }
  }

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
                  {currentPost.type.charAt(0).toUpperCase() + currentPost.type.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4 mr-1" />
                  {currentPost.author.display_name || currentPost.author.username}
                  <Clock className="h-4 w-4 ml-3 mr-1" />
                  {new Date(currentPost.created_at).toLocaleDateString()}
                </div>
              </div>
              <Link href={`/posts/${currentPost.id}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-3 font-serif hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors">
                  {currentPost.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">{currentPost.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {currentPost.tags?.map((tag) => (
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

            {currentPost.image_url && (
              <div className="flex-shrink-0">
                <Image
                  src={currentPost.image_url || "/placeholder.svg"}
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
                postId={parseInt(currentPost.id)}
                initialVotes={currentPost.votes}
                initialUserVote={currentPost.user_vote}
                onVote={handleVote}
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
                {currentPost.comment_count}
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
              asChild
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
            >
              <Link href={`/posts/${currentPost.id}`}>
                Read More
              </Link>
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
              <div className="text-center py-4">
                <Link href={`/posts/${currentPost.id}`}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                    View Full Discussion
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}