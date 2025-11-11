import { NextRequest, NextResponse } from 'next/server'

const MAILTM_API_BASE = 'https://api.mail.tm'

interface Domain {
  id: string
  domain: string
}

interface AccountResponse {
  id: string
  address: string
  token: string
}

export async function POST(request: NextRequest) {
  try {
    // Step 1: Get available domains
    const domainsResponse = await fetch(`${MAILTM_API_BASE}/domains`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!domainsResponse.ok) {
      throw new Error('Failed to fetch domains')
    }

    const domainsData = await domainsResponse.json()
    let domains: Domain[] = []
    
    // Handle different response formats
    if (Array.isArray(domainsData)) {
      domains = domainsData
    } else if (domainsData['hydra:member']) {
      domains = domainsData['hydra:member']
    } else if (domainsData.domains) {
      domains = domainsData.domains
    }
    
    if (domains.length === 0) {
      throw new Error('No domains available')
    }

    // Use the first available domain (prefer @mail.tm domain)
    let domainName = 'mail.tm' // Default fallback
    if (domains.length > 0) {
      const mailTmDomain = domains.find((d: any) => {
        const dName = typeof d === 'string' ? d : d.domain
        return dName === 'mail.tm' || dName?.includes('mail.tm')
      })
      const selectedDomain = mailTmDomain || domains[0]
      domainName = typeof selectedDomain === 'string' ? selectedDomain : selectedDomain.domain || 'mail.tm'
    }

    // Step 2: Generate a random email address
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const address = `${randomString}@${domainName}`
    const password = Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 20)

    // Step 3: Create account
    const createAccountResponse = await fetch(`${MAILTM_API_BASE}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        password: password,
      }),
    })

    if (!createAccountResponse.ok) {
      const errorText = await createAccountResponse.text()
      let errorMessage = 'Failed to create account'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.detail || errorMessage
      } catch (e) {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }

    const accountData: any = await createAccountResponse.json()

    // Step 4: Get authentication token
    const tokenResponse = await fetch(`${MAILTM_API_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        password: password,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      let errorMessage = 'Failed to get authentication token'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.detail || errorMessage
      } catch (e) {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }

    const tokenData: any = await tokenResponse.json()

    return NextResponse.json({
      id: accountData.id || accountData['@id'] || address,
      address: accountData.address || address,
      token: tokenData.token || tokenData['@token'] || tokenData,
    })
  } catch (error: any) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate email' },
      { status: 500 }
    )
  }
}

