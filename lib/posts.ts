import { supabase } from './supabase/client'
import { Database } from './database.types'

export type Post = Database['public']['Tables']['posts']['Row'] & {
  author: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
  comment_count: number
  user_vote?: 'up' | 'down' | null
}

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  author: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
  replies?: Comment[]
  user_vote?: 'up' | 'down' | null
}

export class PostService {
  static async getPosts(options: {
    page?: number
    limit?: number
    type?: string
    author?: string
    userId?: string
  } = {}) {
    const { page = 1, limit = 10, type, author, userId } = options
    const offset = (page - 1) * limit

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
        comment_count:comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('type', type)
    }

    if (author) {
      query = query.eq('profiles.username', author)
    }

    const { data: posts, error } = await query

    if (error) throw error

    // Get user votes if userId provided
    if (userId && posts) {
      const postIds = posts.map(p => p.id)
      const { data: votes } = await supabase
        .from('votes')
        .select('post_id, vote_type')
        .eq('user_id', userId)
        .in('post_id', postIds)

      const voteMap = new Map(votes?.map(v => [v.post_id, v.vote_type]) || [])
      
      return posts.map(post => ({
        ...post,
        comment_count: post.comment_count?.[0]?.count || 0,
        user_vote: voteMap.get(post.id) || null
      }))
    }

    return posts?.map(post => ({
      ...post,
      comment_count: post.comment_count?.[0]?.count || 0
    })) || []
  }

  static async getPost(id: string, userId?: string): Promise<Post | null> {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
        comment_count:comments(count)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!post) return null

    // Get user vote if userId provided
    let userVote = null
    if (userId) {
      const { data: vote } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', userId)
        .eq('post_id', id)
        .single()

      userVote = vote?.vote_type || null
    }

    return {
      ...post,
      comment_count: post.comment_count?.[0]?.count || 0,
      user_vote: userVote
    }
  }

  static async createPost(post: {
    title: string
    content: string
    type: string
    tags: string[]
    authorId: string
    imageUrl?: string
  }) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        content: post.content,
        type: post.type as any,
        tags: post.tags,
        author_id: post.authorId,
        image_url: post.imageUrl
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePost(id: string, updates: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async votePost(postId: string, userId: string, voteType: 'up' | 'down' | null) {
    if (voteType === null) {
      // Remove vote
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Upsert vote
      const { error } = await supabase
        .from('votes')
        .upsert({
          post_id: postId,
          user_id: userId,
          vote_type: voteType
        })

      if (error) throw error
    }

    // Update post vote count
    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('post_id', postId)

    const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0
    const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0
    const totalVotes = upVotes - downVotes

    await supabase
      .from('posts')
      .update({ votes: totalVotes })
      .eq('id', postId)

    return { totalVotes, userVote: voteType }
  }

  static async uploadImage(file: File, userId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `post-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}