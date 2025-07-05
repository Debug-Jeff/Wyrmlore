import { type NextRequest, NextResponse } from "next/server"

// Mock vote storage
const votes: Record<string, { postId: number; userId: number; type: "up" | "down" }[]> = {}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const body = await request.json()
    const { userId, voteType } = body

    if (!userId || !voteType) {
      return NextResponse.json({ error: "Missing userId or voteType" }, { status: 400 })
    }

    const userKey = `user_${userId}`
    if (!votes[userKey]) {
      votes[userKey] = []
    }

    // Remove existing vote for this post
    votes[userKey] = votes[userKey].filter((vote) => vote.postId !== postId)

    // Add new vote if not removing
    if (voteType !== null) {
      votes[userKey].push({
        postId,
        userId,
        type: voteType,
      })
    }

    // Calculate total votes for this post
    let totalVotes = 0
    Object.values(votes).forEach((userVotes) => {
      userVotes.forEach((vote) => {
        if (vote.postId === postId) {
          totalVotes += vote.type === "up" ? 1 : -1
        }
      })
    })

    return NextResponse.json({
      success: true,
      totalVotes,
      userVote: voteType,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Calculate total votes
    let totalVotes = 0
    let userVote = null

    Object.values(votes).forEach((userVotes) => {
      userVotes.forEach((vote) => {
        if (vote.postId === postId) {
          totalVotes += vote.type === "up" ? 1 : -1

          if (userId && vote.userId === Number.parseInt(userId)) {
            userVote = vote.type
          }
        }
      })
    })

    return NextResponse.json({
      totalVotes,
      userVote,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get votes" }, { status: 500 })
  }
}
