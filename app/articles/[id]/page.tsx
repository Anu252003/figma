'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ArticlePage {
  id: string
  title: string
  content: string
  order: number
}

interface Article {
  id: string
  title: string
  description: string
  content: string
  pages?: ArticlePage[]
  author: string
  cover?: string
  createdAt: string
  readTime: string
  category: string
  tags: string[]
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`)
        const data = await response.json()
        if (response.ok) {
          setArticle(data.article)
        } else {
          setError(data.error || 'Article not found')
        }
      } catch (err) {
        setError('Failed to load article')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchArticle()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !article) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Article Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'The article you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1">
        {article.cover && (
          <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Articles</span>
          </button>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {article.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Pages Navigation */}
          {article.pages && article.pages.length > 0 && (
            <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Table of Contents</h3>
              <div className="flex flex-wrap gap-2">
                {article.pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setCurrentPageIndex(index)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPageIndex === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {page.order}. {page.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <article className="text-gray-700 dark:text-gray-300 space-y-4">
              {article.pages && article.pages.length > 0 ? (
                // Render current page content
                article.pages[currentPageIndex]?.content.split('\n').map((line, index) => {
                  const trimmedLine = line.trim()

                  // Headers
                  if (trimmedLine.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white first:mt-0">{trimmedLine.replace('# ', '')}</h1>
                  } else if (trimmedLine.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{trimmedLine.replace('## ', '')}</h2>
                  } else if (trimmedLine.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{trimmedLine.replace('### ', '')}</h3>
                  } else if (trimmedLine.startsWith('#### ')) {
                    return <h4 key={index} className="text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-white">{trimmedLine.replace('#### ', '')}</h4>
                  }
                  // List items
                  else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                    const content = trimmedLine.replace(/^[-*] /, '')
                    const parts = content.split(/(\*\*.*?\*\*)/g)
                    return (
                      <li key={index} className="ml-6 mb-2 list-disc">
                        {parts.map((part, partIndex) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">{part.replace(/\*\*/g, '')}</strong>
                          ) : (
                            <span key={partIndex}>{part}</span>
                          )
                        )}
                      </li>
                    )
                  }
                  // Empty lines
                  else if (trimmedLine === '') {
                    return null
                  }
                  // Regular paragraphs
                  else {
                    const parts = trimmedLine.split(/(\*\*.*?\*\*)/g)
                    return (
                      <p key={index} className="mb-4 leading-relaxed">
                        {parts.map((part, partIndex) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">{part.replace(/\*\*/g, '')}</strong>
                          ) : (
                            <span key={partIndex}>{part}</span>
                          )
                        )}
                      </p>
                    )
                  }
                })
              ) : (
                // Render full content if no pages
                article.content.split('\n').map((line, index) => {
                  const trimmedLine = line.trim()

                  if (trimmedLine.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white first:mt-0">{trimmedLine.replace('# ', '')}</h1>
                  } else if (trimmedLine.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{trimmedLine.replace('## ', '')}</h2>
                  } else if (trimmedLine.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{trimmedLine.replace('### ', '')}</h3>
                  } else if (trimmedLine.startsWith('#### ')) {
                    return <h4 key={index} className="text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-white">{trimmedLine.replace('#### ', '')}</h4>
                  } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                    const content = trimmedLine.replace(/^[-*] /, '')
                    const parts = content.split(/(\*\*.*?\*\*)/g)
                    return (
                      <li key={index} className="ml-6 mb-2 list-disc">
                        {parts.map((part, partIndex) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">{part.replace(/\*\*/g, '')}</strong>
                          ) : (
                            <span key={partIndex}>{part}</span>
                          )
                        )}
                      </li>
                    )
                  } else if (trimmedLine === '') {
                    return null
                  } else {
                    const parts = trimmedLine.split(/(\*\*.*?\*\*)/g)
                    return (
                      <p key={index} className="mb-4 leading-relaxed">
                        {parts.map((part, partIndex) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">{part.replace(/\*\*/g, '')}</strong>
                          ) : (
                            <span key={partIndex}>{part}</span>
                          )
                        )}
                      </p>
                    )
                  }
                })
              )}
            </article>
          </div>

          {/* Page Navigation */}
          {article.pages && article.pages.length > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentPageIndex > 0) {
                      setCurrentPageIndex(currentPageIndex - 1)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  disabled={currentPageIndex === 0}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPageIndex + 1} of {article.pages.length}
                </span>
                <button
                  onClick={() => {
                    if (currentPageIndex < (article.pages?.length ?? 0) - 1) {
                      setCurrentPageIndex(currentPageIndex + 1)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  disabled={currentPageIndex === article.pages.length - 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}

