"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, Star, GitFork, Eye, TrendingUp, Tag } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Repository {
  title: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  tags: string[]
}

export default function Trending() {
  const [trendingRepos, setTrendingRepos] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await axios.get("http://127.0.0.1:5000/trending")
        console.log("API Response:", response.data)

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid API response format")
        }

        setTrendingRepos(response.data)
      } catch (error) {
        console.error("Error fetching trending repositories:", error)
        setError("Failed to fetch trending repositories. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingRepos()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-5xl mx-auto p-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-5xl font-bold tracking-tight text-violet-400 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-yellow-400" /> Trending Repositories
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Check out the top trending open-source projects based on stars, forks, and watchers.
            </p>
          </motion.div>

          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
            </div>
          )}

          {error && <div className="text-red-400 text-center mb-8">{error}</div>}

          <div className="space-y-4">
            {trendingRepos.map((repo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-5 border border-gray-800 rounded-lg bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-violet-400">{repo.title}</h3>
                    <p className="text-gray-400">{repo.description}</p>
                  </div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
                      View
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4 text-blue-400" />
                    <span>{repo.forks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-green-400" />
                    <span>{repo.watchers}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {repo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 px-3 py-1 text-xs rounded-full flex items-center text-gray-300"
                    >
                      <Tag className="h-3 w-3 mr-1 text-violet-400" /> {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}