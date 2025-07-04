import { supabase } from './supabase'
import { Database } from './database.types'

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  author: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
  replies?: Comment[]
  user_vote?: 'up' | 'down' | null
}

export class CommentService {
  static async getComments(postId: string, userId?: string): Promise<Comment[]> {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!comments_author_id_fkey(username, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    if (!comments) return []

    // Get user votes if userId provided
    let voteMap = new Map()
    if (userId) {
      const commentIds = comments.map(c => c.id)
      const { data: votes } = await supabase
        .from('votes')
        .select('comment_id, vote_type')
        .eq('user_id', userId)
        .in('comment_id', commentIds)

      voteMap = new Map(votes?.map(v => [v.comment_id, v.vote_type]) || [])
    }

    // Organize comments with replies
    const commentMap = new Map<string, Comment>()
    const topLevelComments: Comment[] = []

    // First pass: create all comments
    comments.forEach(comment => {
      const commentWithVote: Comment = {
        ...comment,
        replies: [],
        user_vote: voteMap.get(comment.id) || null
      }
      commentMap.set(comment.id, commentWithVote)
    })

    // Second pass: organize hierarchy
    comments.forEach(comment => {
      const commentWithVote = commentMap.get(comment.id)!
      
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(commentWithVote)
        }
      } else {
        topLevelComments.push(commentWithVote)
      }
    })

    return topLevelComments
  }

  static async createComment(comment: {
    postId: string
    authorId: string
    content: string
    parentId?: string
  }) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: comment.postId,
        author_id: comment.authorId,
        content: comment.content,
        parent_id: comment.parentId || null
      })
      .select(`
        *,
        author:profiles!comments_author_id_fkey(username, display_name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  }

  static async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async voteComment(commentId: string, userId: string, voteType: 'up' | 'down' | null) {
    if (voteType === null) {
      // Remove vote
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Upsert vote
      const { error } = await supabase
        .from('votes')
        .upsert({
          comment_id: commentId,
          user_id: userId,
          vote_type: voteType
        })

      if (error) throw error
    }

    // Update comment vote count
    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('comment_id', commentId)

    const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0
    const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0
    const totalVotes = upVotes - downVotes

    await supabase
      .from('comments')
      .update({ votes: totalVotes })
      .eq('id', commentId)

    return { totalVotes, userVote: voteType }
  }
}