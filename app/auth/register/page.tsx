"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, Chrome, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Handle registration logic here
  }

  const handleSocialLogin = (provider: string) => {
    // Handle social login
    console.log(`Register with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-stone-100 font-serif mb-2">
              Join the Flight
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">Create your dragon rider account</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Registration */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => handleSocialLogin("google")}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => handleSocialLogin("discord")}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Continue with Discord
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-amber-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-amber-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-sm">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 mt-1"
                    required
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
