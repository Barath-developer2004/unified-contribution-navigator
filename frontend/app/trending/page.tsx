"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, Star, GitFork, Eye, TrendingUp, Tag, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from '@/components/layout/page-container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
  const [timeRange, setTimeRange] = useState("daily")
  const [language, setLanguage] = useState("all")

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
  }, [timeRange, language])

  return (
    <PageContainer>
      <div className="container max-w-6xl mx-auto p-4 py-8">
        <AnimatePresence>
          <motion.div
            key="header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-5xl font-bold tracking-tight text-violet-400 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8" /> Trending Repositories
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the most popular repositories across GitHub
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <Tag className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-400 mb-8">
              {error}
            </div>
          )}

          {/* Results */}
          <div className="grid gap-6">
            {trendingRepos.map((repo, index) => (
              <motion.div
                key={repo.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:border-violet-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-violet-400">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {repo.title}
                          </a>
                        </h3>
                        <p className="text-gray-400 mt-1">{repo.description}</p>
                      </div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 ml-4"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </a>
                    </div>

                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
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

                    <div className="flex flex-wrap gap-2">
                      {repo.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-800/50">
                          <Tag className="h-3 w-3 mr-1 text-violet-400" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </PageContainer>
  )
}