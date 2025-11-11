import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/lib/articles'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const article = articles.find(a => a.id === id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ article })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load article' },
      { status: 500 }
    )
  }
}
