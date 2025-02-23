'use client';

import { useCallback, useEffect, useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import debounce from 'lodash/debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Repository {
  title: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  tags: string[];
  difficulty: string;
  skill_match_score?: number;
}

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const router = useRouter();

  // Memoize the search function to prevent unnecessary re-renders
  const searchRepositories = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setResults([]);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?query=${encodeURIComponent(searchQuery)}`, {
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(response.statusText || 'Search failed');
          }

          const data = await response.json();
          
          // Update results in a transition to avoid blocking the UI
          startTransition(() => {
            setResults(data);
          });
        } catch (error) {
          console.error('Search error:', error);
          setError(error instanceof Error ? error.message : 'An error occurred while searching');
          toast({
            title: "Search Error",
            description: "Failed to fetch search results. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchRepositories(value);
  }, [searchRepositories]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      searchRepositories.cancel();
    };
  }, [searchRepositories]);

  // Error component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="text-center py-8">
      <div className="text-red-500 dark:text-red-400 mb-4">{message}</div>
      <Button 
        onClick={() => {
          setError(null);
          if (query) searchRepositories(query);
        }}
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  );

  // Memoize the repository card component
  const RepositoryCard = useMemo(() => {
    return ({ repo }: { repo: Repository }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-500 transition-colors duration-200"
              >
                {repo.title}
              </a>
            </CardTitle>
            <CardDescription>{repo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-2">
              <span title="Stars">⭐ {repo.stars.toLocaleString()}</span>
              <span title="Forks">🍴 {repo.forks.toLocaleString()}</span>
              <span title="Watchers">👀 {repo.watchers.toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {repo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-violet-100 dark:bg-violet-900 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            {repo.skill_match_score !== undefined && (
              <div className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                Match Score: {repo.skill_match_score}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }, []);

  // Loading skeletons for better UX
  const LoadingSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4 animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Project</h1>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for projects..."
            value={query}
            onChange={handleSearchChange}
            className="w-full p-4 text-lg pr-10"
            aria-label="Search projects"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <ErrorDisplay message={error} />
        ) : loading ? (
          <LoadingSkeletons />
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {results.map((repo) => (
              <RepositoryCard key={repo.url} repo={repo} />
            ))}
          </motion.div>
        ) : query ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No projects found matching your search.
          </div>
        ) : null}
FRONTEND_URL=<your-production-frontend-url>
GITHUB_REDIRECT_URI=<your-production-backend-url>/auth/callback      </AnimatePresence>
    </div>
  );
}
