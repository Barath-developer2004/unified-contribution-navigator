"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Loader2, Search, Star, GitFork, Eye, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Repository {
  title: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  tags: string[]
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5000/search", { query })
      setResults(response.data)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setError("Failed to fetch results. Please try again.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="container max-w-5xl mx-auto p-4 py-8">
        <AnimatePresence>
          <motion.div
            key="header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-5xl font-bold tracking-tight text-violet-400">
              Discover Open Source Projects
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Search millions of repositories and find your next inspiration
            </p>
          </motion.div>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repositories..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white"
              />
              <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-500 text-white">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Search
              </Button>
            </div>
          </form>

          <div className="text-center mb-8">
            <p className="text-gray-400 text-lg">
              Experience the power of our AI-integrated search engine to find the best open-source projects.
            </p>
          </div>

          {error && <div className="text-red-400 text-center mb-8">{error}</div>}

          <div className="space-y-4">
            {results.map((repo, index) => (
              <motion.div
                key={repo.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-5 border border-gray-800 rounded-lg bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-violet-400">{repo.title}</h3>
                    <p className="text-gray-400">{repo.description}</p>
                  </div>
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
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}