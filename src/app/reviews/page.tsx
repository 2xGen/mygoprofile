'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Review {
  name: string
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
    isAnonymous: boolean
  }
  starRating: string
  comment: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

function ReviewsContent() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const locationName = searchParams.get('location')
  const businessTitle = searchParams.get('title') || 'Business'
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/business/reviews?locationName=${encodeURIComponent(locationName!)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if ((session as any)?.accessToken && locationName) { // eslint-disable-line @typescript-eslint/no-explicit-any
      fetchReviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, locationName])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStarRating = (rating: string) => {
    const numRating = parseInt(rating)
    return '★'.repeat(numRating) + '☆'.repeat(5 - numRating)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view reviews</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!locationName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No location specified</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go to Home
          </Link>
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
              <Link href="/" className="text-xl font-semibold text-gray-900">
                MyGoProfile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Reviews for {businessTitle}</h1>
              <p className="text-gray-600">Manage your Google Business Profile reviews</p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading reviews...</p>
                </div>
              ) : error ? (
                <div className="text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchReviews}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-500">No reviews found for this location</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.reviewId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.reviewer.profilePhotoUrl ? (
                            <Image
                              src={review.reviewer.profilePhotoUrl}
                              alt={review.reviewer.displayName}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {review.reviewer.displayName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {review.reviewer.displayName}
                            </h3>
                            <div className="text-yellow-400 text-sm">
                              {getStarRating(review.starRating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createTime)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm text-gray-700">
                              {review.comment}
                            </p>
                          )}
                          {review.reviewReply && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-blue-900">
                                  Business Response
                                </span>
                                <span className="text-xs text-blue-600">
                                  {formatDate(review.reviewReply.updateTime)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-blue-800">
                                {review.reviewReply.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReviewsContent />
    </Suspense>
  )
}
