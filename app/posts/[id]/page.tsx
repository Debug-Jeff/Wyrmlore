"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, User, Edit, Trash2, Share2, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { PostService, Post } from "@/lib/posts"
import { CommentService, Comment } from "@/lib/comments"
import { VotingSystem } from "@/components/voting-system"
import { CommentSystem } from "@/components/comment-system"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const postId = params.id as string

  useEffect(() => {
    loadPost()
    loadComments()
  }, [postId, user])

  const loadPost = async () => {
    try {
      const postData = await PostService.getPost(postId, user?.id)
      setPost(postData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const commentsData = await CommentService.getComments(postId, user?.id)
      setComments(commentsData)
    } catch (error: any) {
      console.error("Failed to load comments:", error)
    }
  }

  const handleVote = async (postId: number, voteType: "up" | "down" | null) => {
    if (!user || !post) return

    try {
      const result = await PostService.votePost(post.id, user.id, voteType)
      setPost({ ...post, votes: result.totalVotes, user_vote: result.userVote })
    } catch (error: any) {
      console.error("Failed to vote:", error)
    }
  }

  const handleAddComment = async (postId: number, content: string, parentId?: number) => {
    if (!user) return

    try {
      await CommentService.createComment({
        postId: post!.id,
        authorId: user.id,
        content,
        parentId: parentId?.toString()
      })
      loadComments() // Reload comments
    } catch (error: any) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleDeletePost = async () => {
    if (!user || !post || post.author_id !== user.id) return

    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await PostService.deletePost(post.id)
        router.push("/community")
      } catch (error: any) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theory":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "art":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "discussion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "question":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "news":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-100 mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "The post you're looking for doesn't exist."}</p>
          <Link href="/community">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link href="/community">
            <Button variant="ghost" className="hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getTypeColor(post.type)}>
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </Badge>
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                    {post.title}
                  </h1>
                </div>

                {/* Action Buttons */}
                {user && post.author_id === user.id && (
                  <div className="flex gap-2">
                    <Link href={`/posts/${post.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleDeletePost}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} alt={post.author.username || "User"} />
                  <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                    {(post.author.display_name || post.author.username || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/users/${post.author_id}`}>
                    <p className="font-semibold text-gray-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400">
                      {post.author.display_name || post.author.username}
                    </p>
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="mb-6">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full rounded-lg object-cover shadow-lg"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <VotingSystem
                    postId={parseInt(post.id)}
                    initialVotes={post.votes}
                    initialUserVote={post.user_vote}
                    onVote={handleVote}
                  />
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{post.comment_count} comments</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-amber-100 dark:hover:bg-amber-900/20">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-amber-100 dark:hover:bg-amber-900/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CommentSystem
            postId={parseInt(post.id)}
            comments={comments.map(comment => ({
              id: parseInt(comment.id),
              author: comment.author.display_name || comment.author.username || "Anonymous",
              avatar: comment.author.avatar_url || "/placeholder.svg",
              content: comment.content,
              timestamp: new Date(comment.created_at).toLocaleString(),
              votes: comment.votes,
              userVote: comment.user_vote,
              replies: comment.replies?.map(reply => ({
                id: parseInt(reply.id),
                author: reply.author.display_name || reply.author.username || "Anonymous",
                avatar: reply.author.avatar_url || "/placeholder.svg",
                content: reply.content,
                timestamp: new Date(reply.created_at).toLocaleString(),
                votes: reply.votes,
                userVote: reply.user_vote,
                isReply: true
              })) || []
            }))}
            onAddComment={handleAddComment}
          />
        </motion.div>
      </div>
    </div>
  )
}