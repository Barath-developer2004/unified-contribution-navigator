"use client"

import React, { useState } from "react"
import { Star, GitFork, Eye, Tag, Sparkles, Filter } from "lucide-react"
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

interface Repository {
  title: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  tags: string[]
  topics: string[]
}

// Mock recommendations data
const recommendations: Repository[] = [
  {
    title: "react-query",
    description: "Powerful asynchronous state management for React applications",
    url: "https://github.com/tanstack/query",
    stars: 35200,
    forks: 2100,
    watchers: 450,
    tags: ["React", "State Management", "TypeScript"],
    topics: ["react", "typescript", "state-management", "async", "hooks"]
  },
  {
    title: "next.js",
    description: "The React Framework for Production",
    url: "https://github.com/vercel/next.js",
    stars: 112000,
    forks: 24800,
    watchers: 1200,
    tags: ["React", "Framework", "SSR"],
    topics: ["react", "javascript", "framework", "ssr", "jamstack"]
  },
  {
    title: "tailwindcss",
    description: "A utility-first CSS framework for rapid UI development",
    url: "https://github.com/tailwindlabs/tailwindcss",
    stars: 73500,
    forks: 3900,
    watchers: 890,
    tags: ["CSS", "Framework", "UI"],
    topics: ["css", "framework", "design", "utility-first", "responsive"]
  },
  {
    title: "shadcn-ui",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS",
    url: "https://github.com/shadcn/ui",
    stars: 45200,
    forks: 2800,
    watchers: 520,
    tags: ["UI", "Components", "React"],
    topics: ["react", "tailwindcss", "radix-ui", "components", "design-system"]
  }
];

export default function Recommend() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("stars")

  const sortedRepos = [...recommendations].sort((a, b) => {
    if (sortBy === "stars") return b.stars - a.stars
    if (sortBy === "forks") return b.forks - a.forks
    return 0
  })

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
              <Sparkles className="h-8 w-8 text-yellow-400" /> Recommended for You
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover projects that match your interests and skills
            </p>
          </motion.div>

          {/* Filters and Sort */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" /> Customize Your View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stars">Most Stars</SelectItem>
                      <SelectItem value="forks">Most Forks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedRepos.map((repo, index) => (
              <motion.div
                key={repo.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-violet-500/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-violet-400">{repo.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                      </div>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="hover:bg-violet-500 hover:text-white">
                          View
                        </Button>
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4 text-blue-400" />
                        <span>{repo.forks}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {repo.topics?.slice(0, 5).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-800/50">
                          <Tag className="h-3 w-3 mr-1 text-violet-400" />
                          {tag}
                        </Badge>
                      ))}
                      {repo.topics?.length > 5 && (
                        <Badge variant="secondary" className="bg-gray-800/50">
                          +{repo.topics.length - 5} more
                        </Badge>
                      )}
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
