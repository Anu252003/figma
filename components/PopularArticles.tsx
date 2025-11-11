'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  description: string
  url: string
  cover?: string
  createdAt: string
  category?: string
}

export default function PopularArticles() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/notion/posts')
        const data = await response.json()
        console.log('Fetched posts data:', data)
        if (response.ok) {
          setPosts(data.posts || [])
          if (data.error) {
            console.warn('API warning:', data.error)
          }
        } else {
          setError(data.error || 'Failed to fetch posts')
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts)
          }
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to fetch posts. Please try again.')
        try {
          const articlesResponse = await fetch('/api/articles')
          const articlesData = await articlesResponse.json()
          if (articlesData.articles && articlesData.articles.length > 0) {
            const localPosts = articlesData.articles.map((article: any) => ({
              id: article.id,
              title: article.title,
              description: article.description,
              url: `/articles/${article.id}`,
              cover: article.cover,
              createdAt: article.createdAt,
              category: article.category,
            }))
            setPosts(localPosts)
            setError(null)
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Popular Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error && posts.length === 0 && !loading) {
    return (
      <section className="container mx-auto px-4 py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Popular Articles
        </h2>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>{error}</p>
          <p className="text-sm mt-2">Make sure to configure your Notion API key and database ID</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Popular Articles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Discover our latest blog posts and articles about privacy, security, and email management
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            View All Articles
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <p>No articles available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              <Link
                key={post.id}
                href={post.url}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                {post.cover ? (
                  <div className="h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                    <img
                      src={post.cover}
                      alt={post.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredPost === post.id ? 'scale-110' : 'scale-100'
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <svg className="w-20 h-20 text-white opacity-50 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {post.category && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 group-hover:underline text-sm font-medium flex items-center space-x-1">
                      <span>Read more</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
