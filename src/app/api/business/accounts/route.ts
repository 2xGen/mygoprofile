import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleBusinessAPI } from '@/lib/google-business-api'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const businessAPI = new GoogleBusinessAPI(session.accessToken as string)
    const accounts = await businessAPI.getBusinessAccounts()

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching business accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business accounts' },
      { status: 500 }
    )
  }
}
