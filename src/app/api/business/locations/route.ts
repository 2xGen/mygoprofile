import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleBusinessAPI } from '@/lib/google-business-api'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!(session as any)?.accessToken) { // eslint-disable-line @typescript-eslint/no-explicit-any
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountName = searchParams.get('accountName')

    if (!accountName) {
      return NextResponse.json(
        { error: 'Account name is required' },
        { status: 400 }
      )
    }

    const businessAPI = new GoogleBusinessAPI((session as any).accessToken as string) // eslint-disable-line @typescript-eslint/no-explicit-any
    const locations = await businessAPI.getBusinessLocations(accountName)

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching business locations:', error)
    
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
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Account not found or no locations available' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch business locations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
