import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email } = await request.json()

    // Validate input
    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'First name and email are required' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Validate the email format
    // 2. Store the subscription in your database
    // 3. Send a confirmation email
    // 4. Integrate with your email marketing service (Mailchimp, SendGrid, etc.)

    // For now, we'll just log it and return success
    console.log('Newsletter subscription:', { firstName, lastName, email })

    // Example: You could send an email here using a service like SendGrid
    // await sendWelcomeEmail(email, firstName)

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully subscribed to newsletter'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
