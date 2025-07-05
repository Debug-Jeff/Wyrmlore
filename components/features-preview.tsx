"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Palette, BookOpen, Star } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesPreview() {
  const features = [
    {
      icon: MessageSquare,
      title: "Community Discussions",
      description: "Share theories, discuss lore, and connect with fellow dragon enthusiasts in our vibrant community.",
      stats: "1.2k active discussions",
      color: "bg-blue-500",
    },
    {
      icon: Palette,
      title: "Fanart Gallery",
      description: "Showcase your dragon artwork and discover incredible creations from talented artists worldwide.",
      stats: "850+ artworks shared",
      color: "bg-purple-500",
    },
    {
      icon: BookOpen,
      title: "Dragon Codex",
      description: "Explore our comprehensive dragon encyclopedia with detailed lore, abilities, and classifications.",
      stats: "47 dragons catalogued",
      color: "bg-amber-500",
    },
  ]

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-stone-100 mb-6 font-serif">
            Discover the World of Dragons
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of fans in exploring the rich universe of How to Train Your Dragon through community,
            creativity, and comprehensive lore.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-stone-50 to-white dark:from-gray-700 dark:to-gray-800">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 font-semibold">
                    <Star className="h-4 w-4 mr-2" />
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
