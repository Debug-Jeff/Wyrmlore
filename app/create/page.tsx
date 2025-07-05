"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3, ImageIcon, Upload, X, Plus, Eye, Save, Send } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { PostService } from "@/lib/posts"

export default function CreatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("post")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    type: "discussion",
    tags: [] as string[],
  })
  const [artData, setArtData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    medium: "",
    file: null as File | null,
  })
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const postTypes = [
    { value: "discussion", label: "Discussion", color: "bg-blue-500" },
    { value: "theory", label: "Theory", color: "bg-purple-500" },
    { value: "question", label: "Question", color: "bg-green-500" },
    { value: "news", label: "News", color: "bg-orange-500" },
  ]

  const artMediums = [
    "Digital Art",
    "Traditional Drawing",
    "Painting",
    "3D Model",
    "Photography",
    "Mixed Media",
    "Other",
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

  const handleAddTag = (tag: string) => {
    if (activeTab === "post") {
      if (!postData.tags.includes(tag) && postData.tags.length < 5) {
        setPostData({ ...postData, tags: [...postData.tags, tag] })
      }
    } else {
      if (!artData.tags.includes(tag) && artData.tags.length < 5) {
        setArtData({ ...artData, tags: [...artData.tags, tag] })
      }
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (activeTab === "post") {
      setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== tagToRemove) })
    } else {
      setArtData({ ...artData, tags: artData.tags.filter((tag) => tag !== tagToRemove) })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (activeTab === "post") {
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setArtData({ ...artData, file })
      }
    }
  }

  const handleSubmit = async (isDraft = false) => {
    if (!user) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      if (activeTab === "post") {
        let imageUrl = ""
        
        // Upload image if selected
        if (imageFile) {
          imageUrl = await PostService.uploadImage(imageFile, user.id)
        }
        
        await PostService.createPost({
          title: postData.title,
          content: postData.content,
          type: postData.type,
          tags: postData.tags,
          authorId: user.id,
          imageUrl
        })
        
        router.push("/community")
      } else {
        // Handle art upload (similar implementation)
        console.log("Art upload not implemented yet")
      }
    } catch (error: any) {
      setError(error.message || "Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Create Content</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your thoughts, theories, and artwork with the dragon community
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700">
              <TabsTrigger value="post" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Edit3 className="h-4 w-4 mr-2" />
                Create Post
              </TabsTrigger>
              <TabsTrigger value="art" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Art
              </TabsTrigger>
            </TabsList>

            {/* Create Post Tab */}
            <TabsContent value="post">
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
                    <Select value={postData.type} onValueChange={(value) => setPostData({ ...postData, type: value })}>
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
                      value={postData.title}
                      onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                      className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Image (Optional)</Label>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-w-md rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null)
                              setImageFile(null)
                            }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="post-image-upload"
                        />
                        <label htmlFor="post-image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-300">
                            {imagePreview ? "Change image" : "Upload an image"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, theories, or start a discussion..."
                      value={postData.content}
                      onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                      className="min-h-[200px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">Tags (up to 5)</Label>

                    {/* Current Tags */}
                    {postData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {postData.tags.map((tag) => (
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
                        disabled={postData.tags.length >= 5}
                      />
                      <Button
                        variant="outline"
                        onClick={() => newTag.trim() && handleAddTag(newTag.trim())}
                        disabled={!newTag.trim() || postData.tags.length >= 5}
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
                          .filter((tag) => !postData.tags.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTag(tag)}
                              disabled={postData.tags.length >= 5}
                              className="h-7 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            >
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-6 border-t border-amber-200 dark:border-amber-700">
                    <Button
                      variant="outline"
                      onClick={() => setIsPreview(!isPreview)}
                      className="border-amber-200 dark:border-amber-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {isPreview ? "Edit" : "Preview"}
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSubmit(true)}
                        className="border-amber-200 dark:border-amber-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button
                        onClick={() => handleSubmit(false)}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        disabled={!postData.title.trim() || !postData.content.trim() || isSubmitting}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Publishing..." : "Publish Post"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upload Art Tab */}
            <TabsContent value="art">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Upload Artwork
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Artwork File</Label>
                    <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-lg p-8 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="art-upload"
                      />
                      <label htmlFor="art-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {artData.file ? artData.file.name : "Upload your artwork"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drag and drop or click to select (PNG, JPG, GIF up to 10MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="art-title" className="text-gray-700 dark:text-gray-300">
                      Title
                    </Label>
                    <Input
                      id="art-title"
                      placeholder="Give your artwork a title"
                      value={artData.title}
                      onChange={(e) => setArtData({ ...artData, title: e.target.value })}
                      className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="art-description" className="text-gray-700 dark:text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="art-description"
                      placeholder="Describe your artwork, inspiration, or process..."
                      value={artData.description}
                      onChange={(e) => setArtData({ ...artData, description: e.target.value })}
                      className="min-h-[120px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                    />
                  </div>

                  {/* Medium */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Art Medium</Label>
                    <Select value={artData.medium} onValueChange={(value) => setArtData({ ...artData, medium: value })}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700">
                        <SelectValue placeholder="Select art medium" />
                      </SelectTrigger>
                      <SelectContent>
                        {artMediums.map((medium) => (
                          <SelectItem key={medium} value={medium}>
                            {medium}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">Tags (up to 5)</Label>

                    {/* Current Tags */}
                    {artData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {artData.tags.map((tag) => (
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
                        disabled={artData.tags.length >= 5}
                      />
                      <Button
                        variant="outline"
                        onClick={() => newTag.trim() && handleAddTag(newTag.trim())}
                        disabled={!newTag.trim() || artData.tags.length >= 5}
                        className="border-amber-200 dark:border-amber-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Suggested Tags */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Fanart",
                          "Digital Art",
                          "Night Fury",
                          "Light Fury",
                          "Dragons",
                          "HTTYD",
                          "Character Art",
                          "Landscape",
                        ]
                          .filter((tag) => !artData.tags.includes(tag))
                          .slice(0, 6)
                          .map((tag) => (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTag(tag)}
                              disabled={artData.tags.length >= 5}
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
                      variant="outline"
                      onClick={() => handleSubmit(true)}
                      className="border-amber-200 dark:border-amber-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => handleSubmit(false)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={!artData.file || !artData.title.trim()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Artwork
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
