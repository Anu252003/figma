import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Contact form submission:', data)
    // In production, store to DB or send email to support
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact submit error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
