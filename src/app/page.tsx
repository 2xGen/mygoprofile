'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BusinessAccount {
  name: string
  accountName: string
  type: string
  state: string
}

interface BusinessLocation {
  name: string
  title: string
  address: {
    addressLines: string[]
    locality: string
    region: string
    postalCode: string
    country: string
  }
  primaryPhone: string
  websiteUri: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [accounts, setAccounts] = useState<BusinessAccount[]>([])
  const [locations, setLocations] = useState<BusinessLocation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ((session as any)?.accessToken) { // eslint-disable-line @typescript-eslint/no-explicit-any
      fetchBusinessData()
    }
  }, [session])

  const fetchBusinessData = async () => {
    setLoading(true)
    try {
      // Fetch business accounts
      const accountsResponse = await fetch('/api/business/accounts')
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData.accounts || [])
        
        // Fetch locations for all accounts
        const allLocations: BusinessLocation[] = []
        for (const account of accountsData.accounts || []) {
          const locationsResponse = await fetch(
            `/api/business/locations?accountName=${encodeURIComponent(account.name)}`
          )
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json()
            allLocations.push(...(locationsData.locations || []))
          }
        }
        setLocations(allLocations)
      }
    } catch (error) {
      console.error('Error fetching business data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              MyGoProfile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage your Google Business Profile reviews and insights
            </p>
          </div>
          <div>
            <button
              onClick={() => signIn('google')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">MyGoProfile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select Your Business
            </h2>
            <p className="text-gray-600 mb-8">
              Choose which Google Business Profile you'd like to manage
            </p>
            
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your businesses...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {locations.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locations.map((location, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{location.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          {location.address?.addressLines?.join(', ') && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {location.address?.addressLines?.join(', ')}
                            </p>
                          )}
                          {location.address?.locality && location.address?.region && (
                            <p className="text-gray-500">
                              {location.address.locality}, {location.address.region} {location.address.postalCode}
                            </p>
                          )}
                          {location.primaryPhone && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {location.primaryPhone}
                            </p>
                          )}
                          {location.websiteUri && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <a href={location.websiteUri} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                Visit Website
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <Link
                            href={`/reviews?location=${encodeURIComponent(location.name)}&title=${encodeURIComponent(location.title)}`}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center transition-colors"
                          >
                            Manage Reviews
                          </Link>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Analytics
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any Google Business Profiles associated with this account.
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://business.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Create a Business Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}