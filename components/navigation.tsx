"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, ScrollText, Palette, BookOpen, Map, User, Menu, X, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { icon: Home, label: "Home", href: "/", badge: null },
    { icon: ScrollText, label: "Scrolls", href: "/community", badge: "12" },
    { icon: Palette, label: "Gallery", href: "/gallery", badge: null },
    { icon: BookOpen, label: "Codex", href: "/dragons", badge: "47" },
    { icon: Map, label: "Berk Map", href: "/timeline", badge: "Soon" },
    { icon: User, label: "Profile", href: "/dashboard", badge: null },
  ]

  return (
    <>
      {/* Desktop Navigation - The Rune Ledger */}
      <motion.nav 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex fixed left-0 top-0 h-full bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-r border-amber-200 dark:border-gray-700 z-40 shadow-xl"
      >
        <div className="flex flex-col w-full p-6 relative">
          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800 z-10 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            )}
          </Button>

          {/* Logo */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">Wyrmlore</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">The Rune Ledger</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">W</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full h-12 px-4 hover:bg-amber-100 dark:hover:bg-amber-900/20 group transition-all duration-200 ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 flex-shrink-0" />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between w-full ml-3"
                      >
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge className="bg-amber-500 text-white text-xs">{item.badge}</Badge>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Collapsed badge indicator */}
                  {isCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="mt-auto pt-6 border-t border-amber-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-full h-12 px-4 hover:bg-amber-100 dark:hover:bg-amber-900/20 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title={isCollapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-600 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 text-amber-600 flex-shrink-0" />
              )}
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-700 dark:text-gray-300 ml-3"
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - The Sky Banner */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-amber-200 dark:border-gray-700 z-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">Wyrmlore</h1>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-amber-100 dark:hover:bg-amber-900/20"
            >
              {isOpen ? <X className="h-6 w-6 text-amber-600" /> : <Menu className="h-6 w-6 text-amber-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 px-4 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      {item.badge && <Badge className="ml-auto bg-amber-500 text-white text-xs">{item.badge}</Badge>}
                    </Button>
                  </Link>
                ))}

                <div className="pt-4 border-t border-amber-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setIsOpen(false)
                    }}
                    className="w-full justify-start h-12 px-4 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 mr-3 text-amber-600" />
                    ) : (
                      <Moon className="h-5 w-5 mr-3 text-amber-600" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navigation - Dynamic width based on collapse state */}
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block pt-0" 
      />
      <div className="lg:hidden pt-16" />
    </>
  )
}