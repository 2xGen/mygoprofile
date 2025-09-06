import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleBusinessAPI } from '@/lib/google-business-api'

export async function GET() {
  console.log('=== ACCOUNTS API ROUTE CALLED ===')
  try {
    const session = await getServerSession(authOptions)
    console.log('Session exists:', !!session)
    console.log('Access token exists:', !!(session as any)?.accessToken) // eslint-disable-line @typescript-eslint/no-explicit-any
    
    if (!(session as any)?.accessToken) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log('No access token, returning 401')
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 })
    }

    console.log('Creating GoogleBusinessAPI instance...')
    const businessAPI = new GoogleBusinessAPI((session as any).accessToken as string) // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log('Calling getBusinessAccounts...')
    const accounts = await businessAPI.getBusinessAccounts()
    console.log('Accounts result:', accounts)

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching business accounts:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('insufficient_scope')) {
        return NextResponse.json(
          { error: 'Insufficient permissions. Please re-authenticate with Google Business Profile access.' },
          { status: 403 }
        )
      }
      if (error.message.includes('invalid_grant')) {
        return NextResponse.json(
          { error: 'Authentication expired. Please sign in again.' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch business accounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
