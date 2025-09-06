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
        
        // Fetch locations for the first account
        if (accountsData.accounts?.length > 0) {
          const locationsResponse = await fetch(
            `/api/business/locations?accountName=${encodeURIComponent(accountsData.accounts[0].name)}`
          )
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json()
            setLocations(locationsData.locations || [])
          }
        }
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
              Business Dashboard
            </h2>
            
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading business data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Business Accounts ({accounts.length})
                  </h3>
                  {accounts.length > 0 ? (
                    <div className="grid gap-4">
                      {accounts.map((account, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                          <p className="text-sm text-gray-600">Type: {account.type}</p>
                          <p className="text-sm text-gray-600">State: {account.state}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No business accounts found</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Business Locations ({locations.length})
                  </h3>
                  {locations.length > 0 ? (
                    <div className="grid gap-4">
                      {locations.map((location, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-900">{location.title}</h4>
                          <p className="text-sm text-gray-600">
                            {location.address?.addressLines?.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {location.address?.locality}, {location.address?.region} {location.address?.postalCode}
                          </p>
                          {location.primaryPhone && (
                            <p className="text-sm text-gray-600">Phone: {location.primaryPhone}</p>
                          )}
                          {location.websiteUri && (
                            <p className="text-sm text-gray-600">
                              Website: <a href={location.websiteUri} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{location.websiteUri}</a>
                            </p>
                          )}
                          <div className="mt-2">
                            <Link
                              href={`/reviews?location=${encodeURIComponent(location.name)}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Reviews →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No business locations found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}