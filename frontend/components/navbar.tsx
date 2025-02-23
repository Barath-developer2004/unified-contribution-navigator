'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LoginModal } from './login-modal';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative group">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 fill-current text-violet-400 group-hover:text-violet-300 transition-colors duration-200"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-6 overflow-hidden">
                  <div className="lightning absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-500 transform -rotate-45 animate-lightning"></div>
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">
                CN
              </span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="relative group">
                <Button
                  variant="ghost"
                  className="bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 hover:text-violet-100 transition-all duration-200"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-200"></span>
                </Button>
              </Link>
              <Link href="/trending" className="relative group">
                <Button
                  variant="ghost"
                  className="bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:text-emerald-100 transition-all duration-200"
                >
                  Trending
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-200"></span>
                </Button>
              </Link>
              <Link href="/about" className="relative group">
                <Button
                  variant="ghost"
                  className="bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:text-blue-100 transition-all duration-200"
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-200"></span>
                </Button>
              </Link>
            </nav>
          </nav>

          {/* Theme switcher and auth button */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 relative bg-gray-800 text-gray-200 hover:bg-gray-700">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-gray-800">
                  <Sun className="h-4 w-4 mr-2" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-gray-800">
                  <Moon className="h-4 w-4 mr-2" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-gray-800">
                  <Laptop className="h-4 w-4 mr-2" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setShowLoginModal(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
}
