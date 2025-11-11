'use client'

import { useState, useEffect, useRef } from 'react'

interface EmailMessage {
  id: string
  from: {
    address: string
    name: string
  }
  subject: string
  intro: string
  createdAt: string
  html?: string[]
  text?: string[]
  read?: boolean
}

export default function Inbox() {
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const [newMessageNotification, setNewMessageNotification] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async (showLoading = true) => {
    const savedEmail = localStorage.getItem('tempEmail')
    if (!savedEmail) {
      setError('Please generate an email address first')
      setMessages([])
      return
    }

    if (showLoading) {
      setLoading(true)
    }
    setError(null)
    try {
      const emailData = JSON.parse(savedEmail)
      const response = await fetch(`/api/email/messages?token=${emailData.token}&t=${Date.now()}`)
      const data = await response.json()

      let allMessages: EmailMessage[] = []

      if (response.ok && data.messages) {
        allMessages = (data.messages || []).map((msg: EmailMessage) => ({
          ...msg,
          read: msg.read !== undefined ? msg.read : false,
        }))
      }

      // Also get messages from localStorage (test/custom messages)
      const savedMessages = localStorage.getItem('tempEmailMessages')
      if (savedMessages) {
        try {
          const localMessages = JSON.parse(savedMessages)
          allMessages = [...localMessages, ...allMessages]
        } catch (e) {
          console.error('Error parsing local messages:', e)
        }
      }

      // Check for new messages
      if (allMessages.length > lastMessageCount && lastMessageCount > 0) {
        setNewMessageNotification(true)
        // Play notification sound
        try {
          if (audioRef.current) {
            audioRef.current.play().catch(() => { })
          }
        } catch (e) {
          // Audio play failed, ignore
        }
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Email Received', {
            body: `You have ${allMessages.length - lastMessageCount} new message(s)`,
            icon: '/favicon.svg',
          })
        }
        // Scroll to top to show new messages
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }

      setMessages(allMessages)
      setLastMessageCount(allMessages.length)
      setUnreadCount(allMessages.filter((m: EmailMessage) => !m.read).length)
    } catch (err) {
      setError('Failed to fetch messages. Please try again.')
      console.error(err)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => { })
    }

    // Create audio element for notifications (simple beep sound)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioRef.current = new Audio()
    } catch (e) {
      // Audio context not available
    }

    const savedEmail = localStorage.getItem('tempEmail')
    if (savedEmail) {
      // Initial fetch
      fetchMessages()
      // Real-time polling every 5 seconds
      intervalRef.current = setInterval(() => {
        fetchMessages(false)
      }, 5000)
    }

    // Listen for refresh events from EmailGenerator
    const handleRefresh = () => {
      fetchMessages()
    }

    const handleEmailDeleted = () => {
      setMessages([])
      setSelectedMessage(null)
      setLastMessageCount(0)
      setUnreadCount(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    const handleEmailGenerated = () => {
      // Wait a bit for email to be stored, then fetch messages
      setTimeout(() => {
        fetchMessages()
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            fetchMessages(false)
          }, 5000)
        }
      }, 1000)
    }

    window.addEventListener('refreshInbox', handleRefresh)
    window.addEventListener('emailDeleted', handleEmailDeleted)
    window.addEventListener('emailGenerated', handleEmailGenerated)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('refreshInbox', handleRefresh)
      window.removeEventListener('emailDeleted', handleEmailDeleted)
      window.removeEventListener('emailGenerated', handleEmailGenerated)
    }
  }, [])

  // Update lastMessageCount when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setUnreadCount(messages.filter(m => !m.read).length)
    }
  }, [messages])

  // Clear notification after user sees it
  useEffect(() => {
    if (newMessageNotification) {
      const timer = setTimeout(() => {
        setNewMessageNotification(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [newMessageNotification])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) {
      return 'Just now'
    } else if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = searchQuery === '' ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.intro.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === 'all' || !msg.read

    return matchesSearch && matchesFilter
  })

  const handleMessageClick = (message: EmailMessage) => {
    setSelectedMessage(message)
    markAsRead(message.id)
    setNewMessageNotification(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
                  {unreadCount} unread
                </span>
              )}
              {messages.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                  {messages.length} total
                </span>
              )}
              {newMessageNotification && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full animate-pulse">
                  New message!
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 flex-1 md:flex-initial">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 flex-1 ml-2"
                />
              </div>
              <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  Unread
                </button>
              </div>
              <button
                onClick={() => fetchMessages(true)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                title="Refresh inbox"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-refreshing every 5 seconds</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row h-[700px]">
          {/* Message List */}
          <div className="w-full md:w-2/5 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900/30">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-medium mb-2">
                  {searchQuery ? 'No messages found' : 'No messages yet'}
                </p>
                <p className="text-sm">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Emails sent to your temporary address will appear here automatically'}
                </p>
                {!searchQuery && (
                  <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">Real-time updates every 5 seconds</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map((message) => {
                  const isSelected = selectedMessage?.id === message.id
                  const isUnread = !message.read
                  return (
                    <div
                      key={message.id}
                      className={`group w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                        : isUnread
                          ? 'bg-white dark:bg-gray-800 font-semibold'
                          : 'bg-gray-50 dark:bg-gray-900/30'
                        }`}
                    >
                      <button
                        onClick={() => handleMessageClick(message)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className={`truncate mb-1 ${isUnread
                              ? 'text-gray-900 dark:text-white font-semibold'
                              : 'text-gray-700 dark:text-gray-300'
                              }`}>
                              {message.from.name || message.from.address}
                            </div>
                            <div className={`truncate mb-1 ${isUnread
                              ? 'text-gray-900 dark:text-white font-semibold'
                              : 'text-gray-600 dark:text-gray-400'
                              }`}>
                              {message.subject || '(No Subject)'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                              {formatDate(message.createdAt)}
                            </span>
                            {isUnread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        {message.intro && (
                          <div className={`text-sm line-clamp-2 ${isUnread
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-gray-500 dark:text-gray-500'
                            }`}>
                            {message.intro}
                          </div>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMessage(message.id)
                        }}
                        className="absolute top-2 right-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete message"
                      >
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message View */}
          <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 overflow-y-auto">
            {selectedMessage ? (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedMessage.subject || '(No Subject)'}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">From:</span>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {selectedMessage.from.name || selectedMessage.from.address}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">To:</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {(() => {
                            try {
                              const savedEmail = localStorage.getItem('tempEmail')
                              return savedEmail ? JSON.parse(savedEmail).address : 'Your email'
                            } catch {
                              return 'Your email'
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {selectedMessage.html && selectedMessage.html.length > 0 ? (
                    <div
                      className="text-gray-900 dark:text-white"
                      dangerouslySetInnerHTML={{ __html: selectedMessage.html.join('') }}
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.text && selectedMessage.text.length > 0
                        ? selectedMessage.text.join('\n')
                        : selectedMessage.intro || 'No content'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-medium">Select a message to read</p>
                  <p className="text-sm mt-2">Click on any email in the list to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
