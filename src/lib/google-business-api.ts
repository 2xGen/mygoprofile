// Simple mock API for now - focus on getting OAuth working first
export class GoogleBusinessAPI {
  constructor(accessToken: string) {
    console.log('Google Business API initialized with access token:', accessToken ? 'Present' : 'Missing')
  }

  // Mock business accounts
  async getBusinessAccounts() {
    console.log('Fetching mock business accounts...')
    return {
      accounts: [
        {
          name: 'accounts/123456789',
          accountName: 'My Business Account',
          type: 'PERSONAL',
          state: 'VERIFIED'
        }
      ]
    }
  }

  // Mock business locations
  async getBusinessLocations(accountName: string) {
    console.log('Fetching mock locations for account:', accountName)
    return {
      locations: [
        {
          name: 'accounts/123456789/locations/987654321',
          title: 'My Business Location',
          address: '123 Main St, City, State 12345',
          phoneNumber: '+1-555-123-4567',
          websiteUri: 'https://mybusiness.com'
        }
      ]
    }
  }

  // Mock reviews
  async getReviews(locationName: string) {
    console.log('Fetching mock reviews for location:', locationName)
    return {
      reviews: [
        {
          reviewId: '1',
          reviewer: {
            displayName: 'John Doe',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 'FIVE',
          comment: 'Great service! Highly recommend.',
          createTime: '2024-01-15T10:30:00Z',
          updateTime: '2024-01-15T10:30:00Z'
        },
        {
          reviewId: '2',
          reviewer: {
            displayName: 'Jane Smith',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 'FOUR',
          comment: 'Good experience overall.',
          createTime: '2024-01-10T14:20:00Z',
          updateTime: '2024-01-10T14:20:00Z'
        }
      ]
    }
  }

  // Mock business insights
  async getBusinessInsights(locationName: string) {
    console.log('Fetching mock insights for location:', locationName)
    return {
      insights: {
        totalViews: 1250,
        totalClicks: 89,
        totalCalls: 23,
        totalDirectionRequests: 45
      }
    }
  }
}
