"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

interface VotingSystemProps {
  postId: number
  initialVotes: number
  initialUserVote?: "up" | "down" | null
  onVote?: (postId: number, voteType: "up" | "down" | null) => void
}

export function VotingSystem({ postId, initialVotes, initialUserVote = null, onVote }: VotingSystemProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(initialUserVote)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleVote = async (voteType: "up" | "down") => {
    if (isAnimating) return

    setIsAnimating(true)

    let newVotes = votes
    let newUserVote: "up" | "down" | null = voteType

    // Calculate vote changes
    if (userVote === voteType) {
      // Remove vote
      newUserVote = null
      newVotes = voteType === "up" ? votes - 1 : votes + 1
    } else if (userVote === null) {
      // Add new vote
      newVotes = voteType === "up" ? votes + 1 : votes - 1
    } else {
      // Change vote
      newVotes = voteType === "up" ? votes + 2 : votes - 2
    }

    // Update local state
    setVotes(newVotes)
    setUserVote(newUserVote)

    // Call parent callback
    onVote?.(postId, newUserVote)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      // In real app: await api.vote(postId, newUserVote)
    } catch (error) {
      // Revert on error
      setVotes(votes)
      setUserVote(userVote)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  const playVoteSound = (type: "up" | "down") => {
    // In real app, play sound effect
    console.log(`Playing ${type}vote sound`)
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          handleVote("up")
          playVoteSound("up")
        }}
        disabled={isAnimating}
        className={`h-8 px-2 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors ${
          userVote === "up" ? "bg-green-100 dark:bg-green-900/20" : ""
        }`}
      >
        <motion.div
          animate={userVote === "up" && isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ArrowUp
            className={`h-4 w-4 ${
              userVote === "up" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </motion.div>
      </Button>

      <motion.span
        key={votes}
        initial={{ scale: 1 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`text-sm font-semibold min-w-[2rem] text-center ${
          userVote === "up"
            ? "text-green-600 dark:text-green-400"
            : userVote === "down"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {votes}
      </motion.span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          handleVote("down")
          playVoteSound("down")
        }}
        disabled={isAnimating}
        className={`h-8 px-2 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors ${
          userVote === "down" ? "bg-red-100 dark:bg-red-900/20" : ""
        }`}
      >
        <motion.div
          animate={userVote === "down" && isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ArrowDown
            className={`h-4 w-4 ${
              userVote === "down" ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </motion.div>
      </Button>
    </div>
  )
}
