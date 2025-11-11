import { NextRequest, NextResponse } from 'next/server'

const MAILTM_API_BASE = 'https://api.mail.tm'

interface Message {
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
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Fetch messages
    const messagesResponse = await fetch(`${MAILTM_API_BASE}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!messagesResponse.ok) {
      if (messagesResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }
      throw new Error('Failed to fetch messages')
    }

    const messagesData = await messagesResponse.json()
    let messages: Message[] = []
    
    // Handle different response formats
    if (Array.isArray(messagesData)) {
      messages = messagesData
    } else if (messagesData['hydra:member']) {
      messages = messagesData['hydra:member']
    } else if (messagesData.messages) {
      messages = messagesData.messages
    }

    // Fetch full message content for each message
    const messagesWithContent = await Promise.all(
      messages.map(async (message) => {
        try {
          const messageResponse = await fetch(`${MAILTM_API_BASE}/messages/${message.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          })

          if (messageResponse.ok) {
            const fullMessage = await messageResponse.json()
            return {
              ...message,
              html: fullMessage.html,
              text: fullMessage.text,
            }
          }
          return message
        } catch (error) {
          console.error(`Error fetching message ${message.id}:`, error)
          return message
        }
      })
    )

    // Sort messages by date (newest first)
    messagesWithContent.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      messages: messagesWithContent,
    })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

