"use client"

import React from "react"
import { Star, GitFork, Eye, Tag } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"

interface Repository {
  title: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  tags: string[]
}

const recommendations: Repository[] = [
  {
    title: "cqu-code-index",
    description: "An index including some FOSS (Free and Open Source Software) about Chongqing University / 一份收录与重庆大学有关的 FOSS（自由/开源软件）的目录",
    topics: ["campus", "cqu", "cqu-tool-bucket", "floss", "foss", "free-software", "freesoftware", "open-source", "opensource", "university"],
    url: "https://github.com/cqu-lug/cqu-code-index",
    stars: 27,
    forks: 3,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "bspwm",
    description: "",
    topics: ["bspwm", "foss", "linux", "open-source", "x11", "xorg"],
    url: "https://github.com/ilhamisbored/bspwm",
    stars: 26,
    forks: 2,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "smr",
    description: "Space Merchant Realms open-source game engine",
    topics: ["docker", "foss", "mmo", "mysql", "pbbg", "php8", "space-game"],
    url: "https://github.com/smrealms/smr",
    stars: 26,
    forks: 16,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "behaviopy",
    description: "Behavioral data analysis and plotting in Python.",
    topics: ["animal-behavior", "biomedical", "data-science", "foss", "multimodality", "plotting"],
    url: "https://github.com/TheChymera/behaviopy",
    stars: 26,
    forks: 13,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "licensebat",
    description: "🔐⛵ Effortless dependency compliance with your license policies",
    topics: ["foss", "license-compliance", "license-management", "licenses", "oss"],
    url: "https://github.com/licensebat/licensebat",
    stars: 26,
    forks: 7,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "registration",
    description: "Get your own 'is-not.cool' subdomain!",
    topics: ["dev", "foss", "free", "free-for-dev", "free-for-developers", "subdomain"],
    url: "https://github.com/is-not-cool/registration",
    stars: 26,
    forks: 24,
    commits: 0,
    readme: "",
    languages: []
  },
  {
    title: "cornychat",
    description: "🌽 Corny Chat is an open source audio space built on Jam that integrates Nostr and Lightning",
    topics: ["audio", "bitcoin", "chat", "foss", "lightning", "nostr", "voice"],
    url: "https://github.com/vicariousdrama/cornychat",
    stars: 25,
    forks: 9,
    commits: 0,
    readme: "",
    languages: []
  }
]

export default function Recommend() {
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
            <h1 className="text-5xl font-bold tracking-tight text-violet-400">
              Recommended Repositories
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore some recommended open-source projects.
            </p>
          </motion.div>

          <div className="space-y-4">
            {recommendations.map((repo, index) => (
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
                  {repo.topics.map((tag, i) => (
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
