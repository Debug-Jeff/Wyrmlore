"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, X, Heart, MessageSquare, UserPlus, Star, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: number
  type: "like" | "comment" | "follow" | "mention" | "achievement"
  title: string
  message: string
  user?: {
    name: string
    avatar?: string
  }
  timestamp: string
  read: boolean
  actionUrl?: string
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      title: "New Like",
      message: "DragonLoreKeeper liked your theory about Night Furies",
      user: { name: "DragonLoreKeeper", avatar: "/placeholder.svg" },
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/posts/123",
    },
    {
      id: 2,
      type: "comment",
      title: "New Comment",
      message: "ArtisticRider commented on your fanart",
      user: { name: "ArtisticRider", avatar: "/placeholder.svg" },
      timestamp: "5 minutes ago",
      read: false,
      actionUrl: "/posts/456",
    },
    {
      id: 3,
      type: "follow",
      title: "New Follower",
      message: "BerkWarrior started following you",
      user: { name: "BerkWarrior", avatar: "/placeholder.svg" },
      timestamp: "1 hour ago",
      read: true,
      actionUrl: "/users/789",
    },
    {
      id: 4,
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've earned the 'Theory Master' badge",
      timestamp: "2 hours ago",
      read: false,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance every 10 seconds
        addNotification({
          id: Date.now(),
          type: "like",
          title: "New Like",
          message: "Someone liked your recent post",
          user: { name: "RandomUser" },
          timestamp: "Just now",
          read: false,
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 9)]) // Keep only 10 most recent

    if (soundEnabled) {
      playNotificationSound(notification.type)
    }
  }

  const playNotificationSound = (type: string) => {
    // In real app, play different sounds for different notification types
    console.log(`Playing ${type} notification sound`)
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "mention":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "achievement":
        return <Star className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-amber-100 dark:hover:bg-amber-900/20"
      >
        <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">{unreadCount > 9 ? "9+" : unreadCount}</span>
          </motion.div>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-96 z-50"
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-amber-600 hover:text-amber-700 dark:text-amber-400"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-amber-50 dark:bg-amber-900/10" : ""
                        }`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {notification.user ? (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-sm">
                                  {notification.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getNotificationIcon(notification.type)}
                                  <span className="text-sm font-semibold text-gray-900 dark:text-stone-100">
                                    {notification.title}
                                  </span>
                                  {!notification.read && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.timestamp}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">We'll notify you when something happens</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                  <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">
                    View all notifications
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
