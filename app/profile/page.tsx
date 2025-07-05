"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, MapPin, LinkIcon, Camera, Save, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { AuthService } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    location: "",
    website: "",
  })

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/login")
    return null
  }

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        username: user.profile.username || "",
        displayName: user.profile.display_name || "",
        bio: user.profile.bio || "",
        location: user.profile.location || "",
        website: user.profile.website || "",
      })
    }
  }, [user])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      let avatarUrl = user?.profile?.avatar_url

      // Upload new avatar if provided
      if (avatarFile) {
        avatarUrl = await AuthService.uploadAvatar(user.id, avatarFile)
      }

      // Update profile
      await updateProfile({
        username: formData.username,
        display_name: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar_url: avatarUrl,
      })

      setSuccess("Profile updated successfully!")
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Failed to sign out")
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">Profile Settings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
                      {success}
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-amber-200 dark:border-amber-700">
                        <AvatarImage 
                          src={avatarPreview || user?.profile?.avatar_url || "/placeholder.svg"} 
                          alt="Avatar" 
                        />
                        <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-2xl font-bold">
                          {(formData.displayName || formData.username || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-colors"
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-stone-100">Profile Picture</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click the camera icon to upload a new avatar
                      </p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pl-10 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                        placeholder="Your username"
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-700 dark:text-gray-300">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                      placeholder="Your display name"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="min-h-[100px] bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="pl-10 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                        placeholder="Your location"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
                      Website
                    </Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="pl-10 bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-700 focus:border-amber-500"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-amber-200 dark:border-amber-700">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email address cannot be changed at this time.
                    </p>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-6 border-t border-amber-200 dark:border-amber-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-stone-100 mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full justify-start border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
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