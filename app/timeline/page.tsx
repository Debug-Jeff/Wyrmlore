"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Scroll, Sword, Crown, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)

  const timelineEvents = [
    {
      id: "ancient",
      era: "Ancient Times",
      period: "~1000 years ago",
      color: "bg-purple-500",
      icon: Scroll,
      events: [
        {
          title: "The Dragon Wars",
          description: "Vikings and dragons were locked in endless conflict, with both sides suffering heavy losses.",
          year: "~1000 years ago",
          location: "Barbaric Archipelago",
          significance: "high"
        },
        {
          title: "The Great Dragon Exodus",
          description: "Many dragons fled to the Hidden World to escape the wars with humans.",
          year: "~800 years ago",
          location: "Hidden World",
          significance: "high"
        }
      ]
    },
    {
      id: "berk-founding",
      era: "Berk's Foundation",
      period: "~300 years ago",
      color: "bg-blue-500",
      icon: Crown,
      events: [
        {
          title: "Founding of Berk",
          description: "The island of Berk was settled by Vikings, establishing it as a stronghold against dragons.",
          year: "~300 years ago",
          location: "Isle of Berk",
          significance: "high"
        },
        {
          title: "The First Dragon Manual",
          description: "Early attempts to catalog dragon species and their weaknesses.",
          year: "~250 years ago",
          location: "Berk",
          significance: "medium"
        }
      ]
    },
    {
      id: "hiccup-era",
      era: "Hiccup's Journey",
      period: "15 years ago - Present",
      color: "bg-green-500",
      icon: Heart,
      events: [
        {
          title: "Hiccup Meets Toothless",
          description: "A young Viking shoots down a Night Fury, beginning an unlikely friendship that changes everything.",
          year: "15 years ago",
          location: "Berk",
          significance: "legendary"
        },
        {
          title: "The Red Death's Defeat",
          description: "Hiccup and Toothless defeat the massive Red Death, ending the dragon raids on Berk.",
          year: "15 years ago",
          location: "Dragon Island",
          significance: "legendary"
        },
        {
          title: "Dragon Training Academy",
          description: "Berk establishes the first dragon training academy, teaching Vikings to ride dragons.",
          year: "14 years ago",
          location: "Berk",
          significance: "high"
        },
        {
          title: "Discovery of Dragon Eye",
          description: "Ancient artifact revealing secrets about dragon behavior and the archipelago's history.",
          year: "12 years ago",
          location: "Various locations",
          significance: "high"
        },
        {
          title: "Encounter with Drago Bludvist",
          description: "The dragon riders face their greatest threat in the form of the dragon conqueror Drago.",
          year: "10 years ago",
          location: "Valka's Sanctuary",
          significance: "legendary"
        },
        {
          title: "Stoick's Sacrifice",
          description: "Stoick the Vast gives his life to save his son, and Hiccup becomes Chief of Berk.",
          year: "10 years ago",
          location: "Berk",
          significance: "legendary"
        },
        {
          title: "The Light Fury Appears",
          description: "Toothless encounters a Light Fury, leading to the discovery of the Hidden World.",
          year: "5 years ago",
          location: "New Berk",
          significance: "legendary"
        },
        {
          title: "Grimmel's Hunt",
          description: "The Night Fury killer Grimmel threatens all dragons, forcing difficult decisions.",
          year: "5 years ago",
          location: "New Berk",
          significance: "high"
        },
        {
          title: "The Hidden World Revealed",
          description: "The secret sanctuary of all dragons is discovered beneath the ocean.",
          year: "5 years ago",
          location: "Hidden World",
          significance: "legendary"
        },
        {
          title: "The Great Goodbye",
          description: "Dragons and humans part ways, with dragons retreating to the Hidden World for their safety.",
          year: "5 years ago",
          location: "New Berk",
          significance: "legendary"
        }
      ]
    },
    {
      id: "future",
      era: "The Future",
      period: "Present - Future",
      color: "bg-amber-500",
      icon: MapPin,
      events: [
        {
          title: "The Reunion",
          description: "Hiccup and Toothless reunite after years apart, showing their bond remains unbroken.",
          year: "Present",
          location: "Hidden World",
          significance: "legendary"
        },
        {
          title: "New Generations",
          description: "Hiccup's children learn about dragons and the legacy of their father's friendship with Toothless.",
          year: "Present",
          location: "New Berk",
          significance: "high"
        },
        {
          title: "The Return of Dragons?",
          description: "Speculation about when dragons might return to live alongside humans once again.",
          year: "Future",
          location: "Unknown",
          significance: "unknown"
        }
      ]
    }
  ]

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "legendary":
        return "bg-gold-100 text-gold-800 border-gold-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-stone-100 mb-4 font-serif">
            Dragon Timeline
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The complete history of dragons and Vikings in the Barbaric Archipelago
          </p>
        </motion.div>

        {/* Era Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {timelineEvents.map((era) => (
            <Button
              key={era.id}
              variant={selectedEra === era.id ? "default" : "outline"}
              onClick={() => setSelectedEra(selectedEra === era.id ? null : era.id)}
              className={`${selectedEra === era.id ? era.color + " text-white" : "border-amber-200 dark:border-amber-700"} hover:scale-105 transition-all`}
            >
              <era.icon className="h-4 w-4 mr-2" />
              {era.era}
            </Button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 via-green-500 to-amber-500 rounded-full"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((era, eraIndex) => (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: eraIndex * 0.2 }}
                className={`${selectedEra && selectedEra !== era.id ? "opacity-50" : ""} transition-opacity`}
              >
                {/* Era Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 ${era.color} rounded-full flex items-center justify-center shadow-lg z-10`}>
                    <era.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-stone-100 font-serif">{era.era}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{era.period}</p>
                  </div>
                </div>

                {/* Era Events */}
                <div className="ml-20 space-y-6">
                  {era.events.map((event, eventIndex) => (
                    <motion.div
                      key={eventIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (eraIndex * 0.2) + (eventIndex * 0.1) }}
                    >
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-stone-100 mb-2 font-serif">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {event.year}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <Badge className={getSignificanceColor(event.significance)}>
                              {event.significance}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-stone-100 font-serif">
                Event Significance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gold-100 text-gold-800 border-gold-200">Legendary</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">World-changing events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Major historical events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Important developments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Speculative events</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}