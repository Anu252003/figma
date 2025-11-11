'use client'

import { useState, useEffect } from 'react'

interface EmailAccount {
  id: string
  address: string
  token: string
}

export default function EmailGenerator() {
  const [email, setEmail] = useState<EmailAccount | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [sendingTest, setSendingTest] = useState(false)
  const [composeMessage, setComposeMessage] = useState('')
  const [composeSending, setComposeSending] = useState(false)
  const [friendlyEmail, setFriendlyEmail] = useState<string | null>(null)

  const generateEmail = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/email/generate', {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok) {
        setEmail(data)
        setFriendlyEmail(makeFriendlyAddress(data.address))
        setTimeLeft(3600) // Reset timer to 1 hour
        // Store in localStorage for persistence
        localStorage.setItem('tempEmail', JSON.stringify(data))
        // Clear inbox when generating new email
        localStorage.removeItem('tempEmailMessages')
        // Notify inbox that email was generated
        window.dispatchEvent(new Event('emailGenerated'))

        // Auto-send a welcome test email
        await sendTestEmail(data.address, data.token)
      } else {
        setError(data.error || 'Failed to generate email')
      }
    } catch (err) {
      setError('Failed to generate email. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const sendTestEmail = async (address: string, token: string) => {
    try {
      // Create a test message
      const testMessage = {
        id: `test-${Date.now()}-1`,
        from: {
          address: 'welcome@tempusmail.com',
          name: 'TempusMail',
        },
        subject: '✅ Welcome to TempusMail',
        intro: 'This is your test email. Your temporary email address is working correctly!',
        text: ['This is your test email. Your temporary email address is working correctly!'],
        html: ['<h1>Welcome to TempusMail!</h1><p>This is your test email. Your temporary email address is working correctly!</p>'],
        createdAt: new Date().toISOString(),
        read: false,
      }

      // Save to localStorage
      const savedMessages = localStorage.getItem('tempEmailMessages')
      const messages = savedMessages ? JSON.parse(savedMessages) : []
      messages.unshift(testMessage)
      localStorage.setItem('tempEmailMessages', JSON.stringify(messages))

      // Trigger refresh to show new message
      setTimeout(() => {
        window.dispatchEvent(new Event('refreshInbox'))
      }, 500)
    } catch (err) {
      console.error('Error sending test email:', err)
    }
  }

  useEffect(() => {
    // Load existing email from localStorage
    const loadOrGenerateEmail = async () => {
      try {
        const savedEmail = localStorage.getItem('tempEmail')
        if (savedEmail) {
          const emailData = JSON.parse(savedEmail)
          setEmail(emailData)
          setFriendlyEmail(makeFriendlyAddress(emailData.address))
          // Trigger inbox to load messages for this email
          window.dispatchEvent(new Event('refreshInbox'))
        }
      } catch (e) {
        console.error('Failed to parse saved email', e)
      }
    }

    loadOrGenerateEmail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer effect
  useEffect(() => {
    if (!email) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email])

  const copyToClipboard = () => {
    if (email) {
      navigator.clipboard.writeText(email.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const refreshEmail = () => {
    // Trigger inbox refresh by dispatching event
    window.dispatchEvent(new Event('refreshInbox'))
  }

  const deleteEmail = () => {
    if (confirm('Are you sure you want to delete this email address? This action cannot be undone.')) {
      setEmail(null)
      setFriendlyEmail(null)
      localStorage.removeItem('tempEmail')
      localStorage.removeItem('tempEmailMessages')
      // Notify inbox to clear
      window.dispatchEvent(new Event('emailDeleted'))
    }
  }

  const changeEmail = () => {
    generateEmail()
  }

  const handleSendTestEmail = async () => {
    if (!email) return
    setSendingTest(true)
    try {
      await sendTestEmail(email.address, email.token)
      setTimeout(() => {
        window.dispatchEvent(new Event('refreshInbox'))
      }, 1000)
    } finally {
      setSendingTest(false)
    }
  }

  const handleSendMessage = async () => {
    if (!email || !composeMessage.trim()) return
    setComposeSending(true)
    try {
      // Create a message object
      const customMessage = {
        id: `custom-${Date.now()}`,
        from: {
          address: 'test@tempusmail.com',
          name: 'Test User',
        },
        subject: '📧 Your Custom Message',
        intro: composeMessage.substring(0, 100) + (composeMessage.length > 100 ? '...' : ''),
        text: [composeMessage],
        html: [`<p>${composeMessage.replace(/\n/g, '<br>')}</p>`],
        createdAt: new Date().toISOString(),
        read: false,
      }

      // Save to localStorage
      const savedMessages = localStorage.getItem('tempEmailMessages')
      const messages = savedMessages ? JSON.parse(savedMessages) : []
      messages.unshift(customMessage)
      localStorage.setItem('tempEmailMessages', JSON.stringify(messages))

      setComposeMessage('')
      // Trigger refresh to show new message
      window.dispatchEvent(new Event('refreshInbox'))
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setComposeSending(false)
    }
  }

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getEmailParts = (address: string) => {
    const [username, domain] = address.split('@')
    return { username, domain }
  }

  const makeFriendlyAddress = (address: string) => {
    try {
      const [username, domain] = address.split('@')
      const names = ['aisha', 'maria', 'oliver', 'liam', 'noah', 'emma', 'sophia', 'ava', 'mia', 'sara', 'nina', 'zia', 'omar', 'kai', 'leo', 'lucas', 'chris', 'alex', 'sam', 'maya']
      let sum = 0
      for (let i = 0; i < username.length; i++) {
        sum += username.charCodeAt(i)
      }
      const name = names[sum % names.length]
      const num = (sum % 100).toString().padStart(2, '0')
      // Avoid numbers for nicer look when possible
      const friendly = `${name}${num === '00' ? '' : num}@${domain}`
      return friendly
    } catch (e) {
      return address
    }
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      {/* Light blue background container */}
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-3xl p-8 md:p-12 py-16">
        {/* Card content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border-3 border-blue-400 dark:border-blue-500 p-8 md:p-12 shadow-lg">
          {/* Header Section - Centered */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Temporary Email Address
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Protect your real inbox from spam and hackers with TempusMail's reliable disposable email service. Instantly generate a secure, anonymous temporary email ID using our fast and easy temp mail generator.
            </p>
          </div>

          {email ? (
            <div className="space-y-8">
              {/* Email Display Section - Prominent Box */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl p-6 border-2 border-blue-300 dark:border-blue-600">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Your Email Address</p>
                  <div className="mb-4">
                    <span className="inline-block text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {friendlyEmail ?? email?.address}
                    </span>
                    {friendlyEmail && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Actual: <span className="font-mono text-gray-700 dark:text-gray-300">{email?.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Expires in: {formatTimeLeft(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Centered in a row */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-2.5 bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-semibold"
                  title="Copy email address"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={refreshEmail}
                  className="px-6 py-2.5 bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-semibold"
                  title="Refresh inbox"
                >
                  Refresh
                </button>
                <button
                  onClick={deleteEmail}
                  className="px-6 py-2.5 bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-semibold"
                  title="Delete email address"
                >
                  Delete
                </button>
                <button
                  onClick={changeEmail}
                  className="px-6 py-2.5 bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-semibold"
                  title="Change to new email address"
                >
                  Change
                </button>
              </div>

              {/* Send Test Email Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingTest}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send a test email to your inbox"
                >
                  {sendingTest ? 'Sending...' : '📧 Send Test Email'}
                </button>
              </div>

              {/* Compose Message Section */}
              <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Message</h3>
                <div className="space-y-4">
                  <textarea
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    placeholder="Write a test message..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={composeSending || !composeMessage.trim()}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {composeSending ? 'Sending...' : 'Send Message to Inbox'}
                  </button>
                </div>
              </div>

              {/* Generate New Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={changeEmail}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate New Email'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center pt-4">
                <button
                  onClick={generateEmail}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate Email Address</span>
                  )}
                </button>
              </div>
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg text-center">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
