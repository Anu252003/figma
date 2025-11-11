'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  description: string
  url: string
  cover?: string
  createdAt: string
  author: string
  readTime: string
  category: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch articles directly from articles API
        const response = await fetch('/api/articles')
        const data = await response.json()
        if (response.ok && data.articles) {
          const posts = data.articles.map((article: any) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            url: `/articles/${article.id}`,
            cover: article.cover,
            createdAt: article.createdAt,
            author: article.author,
            readTime: article.readTime,
            category: article.category,
          }))
          setPosts(posts)
          setTotalPages(Math.ceil(posts.length / postsPerPage))
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-950">
      <Header />
      <div className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header with emoji */}
            <div className="mb-12 flex items-center space-x-3">
              <span className="text-3xl">💌</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Blog Posts
              </h1>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent mb-12"></div>

            {currentPosts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>No articles available at the moment.</p>
              </div>
            ) : (
              <>
                {/* Grid Layout - 2 columns on desktop, 1 on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {currentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/articles/${post.id}`}
                      className="group bg-gray-800 hover:bg-gray-700 rounded-3xl shadow-xl border border-gray-700 hover:border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col"
                    >
                      {/* Image Section */}
                      {post.cover ? (
                        <div className="h-64 bg-gray-700 overflow-hidden relative">
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                          <svg className="w-24 h-24 text-white/30 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-8 flex flex-col flex-1">
                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors line-clamp-3">
                          {post.title}
                        </h3>

                        {/* Description */}
                        {post.description && (
                          <p className="text-gray-400 text-base mb-6 line-clamp-3 flex-1">
                            {post.description}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full border border-gray-600">
                            {post.category}
                          </span>
                          {post.readTime && (
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full border border-gray-600">
                              {post.readTime}
                            </span>
                          )}
                        </div>

                        {/* Footer with date */}
                        <div className="pt-6 border-t border-gray-700 flex items-center justify-between">
                          <span className="text-gray-500 text-sm">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-blue-400 group-hover:text-blue-300 transition-colors flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-center space-y-6 mt-16">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      <div className="flex items-center space-x-1">
                        {pageNumbers.map((number) => {
                          if (
                            number === 1 ||
                            number === totalPages ||
                            (number >= currentPage - 1 && number <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-4 py-2 rounded-lg transition-colors font-medium ${currentPage === number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                                  }`}
                              >
                                {number}
                              </button>
                            )
                          } else if (
                            number === currentPage - 2 ||
                            number === currentPage + 2
                          ) {
                            return (
                              <span key={number} className="px-2 text-gray-500">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

