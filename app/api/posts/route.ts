import { type NextRequest, NextResponse } from "next/server"

// Mock database
const posts = [
  {
    id: 1,
    title: "Theory: The Hidden World's Connection to Ancient Dragons",
    content:
      "I've been analyzing the cave paintings in HTTYD3 and I think there's evidence that the Hidden World existed long before Toothless discovered it...",
    author: "DragonLoreKeeper",
    authorId: 1,
    timestamp: "2 hours ago",
    votes: 47,
    comments: 23,
    tags: ["Theory", "Hidden World", "Lore"],
    type: "theory",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "My latest Night Fury artwork - 'Moonlight Flight'",
    content:
      "Spent the weekend working on this piece inspired by Toothless and the Light Fury's first flight together...",
    author: "ArtisticRider",
    authorId: 2,
    timestamp: "4 hours ago",
    votes: 89,
    comments: 15,
    tags: ["Fanart", "Night Fury", "Digital Art"],
    type: "art",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const type = searchParams.get("type")
  const author = searchParams.get("author")

  let filteredPosts = posts

  if (type) {
    filteredPosts = filteredPosts.filter((post) => post.type === type)
  }

  if (author) {
    filteredPosts = filteredPosts.filter((post) => post.author === author)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return NextResponse.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredPosts.length / limit),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, type, tags, authorId, author } = body

    if (!title || !content || !type || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPost = {
      id: posts.length + 1,
      title,
      content,
      type,
      tags: tags || [],
      author: author || "Anonymous",
      authorId,
      timestamp: "Just now",
      votes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    }

    posts.unshift(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
