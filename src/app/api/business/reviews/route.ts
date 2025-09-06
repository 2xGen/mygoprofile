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
    const locationName = searchParams.get('locationName')

    if (!locationName) {
      return NextResponse.json(
        { error: 'Location name is required' },
        { status: 400 }
      )
    }

    const businessAPI = new GoogleBusinessAPI((session as any).accessToken as string) // eslint-disable-line @typescript-eslint/no-explicit-any
    const reviews = await businessAPI.getReviews(locationName)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    
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
          { error: 'Location not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
