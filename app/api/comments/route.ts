import { type NextRequest, NextResponse } from "next/server"

// Mock comments database
const comments = [
  {
    id: 1,
    postId: 1,
    author: "BerkWarrior",
    authorId: 3,
    avatar: "/placeholder.svg",
    content: "This is a fascinating theory! I never thought about the cave paintings that way.",
    timestamp: "1 hour ago",
    votes: 5,
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    postId: 1,
    author: "DragonScholar",
    authorId: 4,
    avatar: "/placeholder.svg",
    content: "Have you considered the architectural similarities to real-world ancient civilizations?",
    timestamp: "45 minutes ago",
    votes: 3,
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    postId: 1,
    author: "DragonLoreKeeper",
    authorId: 1,
    avatar: "/placeholder.svg",
    content: "Great point! I actually have some research on that topic I can share.",
    timestamp: "30 minutes ago",
    votes: 2,
    parentId: 2,
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 })
  }

  const postComments = comments.filter((comment) => comment.postId === Number.parseInt(postId))

  // Organize comments with replies
  const topLevelComments = postComments.filter((comment) => !comment.parentId)
  const organizedComments = topLevelComments.map((comment) => ({
    ...comment,
    replies: postComments.filter((reply) => reply.parentId === comment.id),
  }))

  return NextResponse.json({
    comments: organizedComments,
    total: postComments.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, content, authorId, author, parentId } = body

    if (!postId || !content || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newComment = {
      id: comments.length + 1,
      postId: Number.parseInt(postId),
      author: author || "Anonymous",
      authorId,
      avatar: "/placeholder.svg",
      content,
      timestamp: "Just now",
      votes: 0,
      parentId: parentId ? Number.parseInt(parentId) : null,
      createdAt: new Date().toISOString(),
    }

    comments.unshift(newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
