"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Reply, Heart, MoreHorizontal, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { VotingSystem } from "./voting-system"

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  timestamp: string
  votes: number
  userVote?: "up" | "down" | null
  replies?: Comment[]
  isReply?: boolean
}

interface CommentSystemProps {
  postId: number
  comments: Comment[]
  onAddComment?: (postId: number, content: string, parentId?: number) => void
}

export function CommentSystem({ postId, comments: initialComments, onAddComment }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    const comment: Comment = {
      id: Date.now(),
      author: "CurrentUser", // In real app, get from auth
      content: newComment,
      timestamp: "Just now",
      votes: 0,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
    onAddComment?.(postId, newComment)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
  }

  const handleAddReply = async (parentId: number) => {
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)

    const reply: Comment = {
      id: Date.now(),
      author: "CurrentUser",
      content: replyContent,
      timestamp: "Just now",
      votes: 0,
      isReply: true,
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [reply, ...(comment.replies || [])] } : comment,
      ),
    )

    setReplyContent("")
    setReplyingTo(null)
    onAddComment?.(postId, replyContent, parentId)

    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
  }

  const handleVote = (commentId: number, voteType: "up" | "down" | null) => {
    // Update comment vote in state
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, userVote: voteType }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, userVote: voteType } : reply,
            ),
          }
        }
        return comment
      }),
    )
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? "ml-12 mt-4" : ""}`}
    >
      <Card
        className={`bg-white dark:bg-gray-800 border-0 shadow-sm ${isReply ? "border-l-4 border-amber-200 dark:border-amber-700" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
              <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-sm">
                {comment.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-stone-100 text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">{comment.content}</p>

              <div className="flex items-center gap-4">
                <VotingSystem
                  postId={comment.id}
                  initialVotes={comment.votes}
                  initialUserVote={comment.userVote}
                  onVote={handleVote}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="h-8 px-3 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-gray-600 dark:text-gray-400"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-gray-600 dark:text-gray-400"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Like
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-gray-600 dark:text-gray-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {replyingTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs">
                          CU
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder={`Reply to ${comment.author}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500 text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyContent.trim() || isSubmitting}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                CU
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts on this post..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 font-serif">Comments ({comments.length})</h3>

        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
