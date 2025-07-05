"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Plus, Eye, Save, Send, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { PostService } from "@/lib/posts"

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "discussion",
    tags: [] as string[],
  })

  const postTypes = [
    { value: "discussion", label: "Discussion", color: "bg-blue-500" },
    { value: "theory", label: "Theory", color: "bg-purple-500" },
    { value: "question", label: "Question", color: "bg-green-500" },
    { value: "art", label: "Art", color: "bg-pink-500" },
    { value: "news", label: "News", color: "bg-orange-500" },
  ]

  const suggestedTags = [
    "Theory",
    "Discussion",
    "Fanart",
    "Night Fury",
    "Light Fury",
    "Hidden World",
    "Berk",
    "Dragons",
    "HTTYD",
    "Movies",
    "TV Series",
    "Lore",
    "Analysis",
  ]

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleSubmit = async (isDraft = false) => {
    if (!user) return

    setError("")
    setIsLoading(true)

    try {
      let imageUrl = null
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await PostService.uploadImage(imageFile, user.id)
      }

      // Create post
      const post = await PostService.createPost({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags: formData.tags,
        authorId: user.id,
        imageUrl
      })

      router.push(`/posts/${post.id}`)
    } catch (error: any) {
      setError(error.message || "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/community">
            <Button variant="ghost" className="hover:bg-amber-100 dark:hover:bg-amber-900/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Create New Post</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your thoughts, theories, and artwork with the dragon community
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
                  {error}
                </div>
              )}

              {/* Post Type */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Post Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {postTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="What's your post about?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Image (Optional)</Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-lg p-8 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Upload an image
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, theories, or start a discussion..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300">Tags (up to 5)</Label>

                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 pr-1"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-amber-200 dark:hover:bg-amber-800"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newTag.trim()) {
                        handleAddTag(newTag.trim())
                      }
                    }}
                    className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700"
                    disabled={formData.tags.length >= 5}
                  />
                  <Button
                    variant="outline"
                    onClick={() => newTag.trim() && handleAddTag(newTag.trim())}
                    disabled={!newTag.trim() || formData.tags.length >= 5}
                    className="border-amber-200 dark:border-amber-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested Tags */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter((tag) => !formData.tags.includes(tag))
                      .slice(0, 8)
                      .map((tag) => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(tag)}
                          disabled={formData.tags.length >= 5}
                          className="h-7 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-amber-200 dark:border-amber-700">
                <Button
                  onClick={() => handleSubmit(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={!formData.title.trim() || !formData.content.trim() || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}