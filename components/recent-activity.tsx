"use client"

import { ScrollCard } from "@/components/scroll-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function RecentActivity() {
  const recentPosts = [
    {
      id: 1,
      title: "Theory: The Hidden World's Connection to Ancient Dragons",
      content:
        "I've been analyzing the cave paintings in HTTYD3 and I think there's evidence that the Hidden World existed long before Toothless discovered it. The symbols suggest...",
      author: "DragonLoreKeeper",
      timestamp: "2 hours ago",
      votes: 47,
      comments: 23,
      tags: ["Theory", "Hidden World", "Lore"],
      type: "theory",
    },
    {
      id: 2,
      title: "My latest Night Fury artwork - 'Moonlight Flight'",
      content:
        "Spent the weekend working on this piece inspired by Toothless and the Light Fury's first flight together. Used digital painting techniques to capture the ethereal glow...",
      author: "ArtisticRider",
      timestamp: "4 hours ago",
      votes: 89,
      comments: 15,
      tags: ["Fanart", "Night Fury", "Digital Art"],
      type: "art",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Discussion: Ranking all dragon classes by combat effectiveness",
      content:
        "Let's settle this once and for all! I'm creating a tier list of dragon classes based on their combat abilities. Starting with Strike Class at the top...",
      author: "BerkWarrior",
      timestamp: "6 hours ago",
      votes: 34,
      comments: 67,
      tags: ["Discussion", "Dragon Classes", "Combat"],
      type: "discussion",
    },
  ]

  return (
    <section className="py-24 px-4 bg-stone-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-stone-100 mb-6 font-serif">
            Latest from the Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See what dragon riders are discussing, creating, and discovering
          </p>
        </motion.div>

        <div className="space-y-6">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ScrollCard post={post} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Community Posts
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
