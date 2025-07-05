"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Palette, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-amber-400 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
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

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-stone-100 mb-6 font-serif">Wyrmlore</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
            Where dragons gather, and lore lives on
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A digital sanctuary where How to Train Your Dragon fans share theories, fanart, lore, and build community
            around dragonkind.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Join the Flight
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/posts/create">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amber-300 dark:border-amber-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-8 py-4 text-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
            >
              Create Post
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">2.4k</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Dragon Riders</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Palette className="h-6 w-6 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">850</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Artworks</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-6 w-6 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-stone-100">47</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Dragons</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
