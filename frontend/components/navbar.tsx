import { Github } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-75" />
              <div className="relative bg-black rounded-full p-1">
                <Github className="h-6 w-6" />
              </div>
            </div>
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              FOSS Search
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Link href="/trending">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Trending
              </Button>
            </Link>
            <Link href="/recommend">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Recommendation
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-800" />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

