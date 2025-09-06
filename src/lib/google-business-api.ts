import { google } from 'googleapis'

export class GoogleBusinessAPI {
  private oauth2Client: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2()
    this.oauth2Client.setCredentials({
      access_token: accessToken
    })
  }

  // Get business accounts
  async getBusinessAccounts() {
    try {
      const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessaccountmanagement.accounts.list()
      return response.data
    } catch (error) {
      console.error('Error fetching business accounts:', error)
      throw error
    }
  }

  // Get business locations
  async getBusinessLocations(accountName: string) {
    try {
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessbusinessinformation.accounts.locations.list({
        parent: accountName
      })
      return response.data
    } catch (error) {
      console.error('Error fetching business locations:', error)
      throw error
    }
  }

  // Get reviews for a location
  async getReviews(locationName: string) {
    try {
      // For now, return mock data since the exact API structure needs to be verified
      // TODO: Implement proper Google Business Profile reviews API call
      console.log('Fetching reviews for location:', locationName)
      
      // Mock reviews data for testing
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
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  }

  // Get business insights/performance data
  async getBusinessInsights(locationName: string) {
    try {
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessbusinessinformation.accounts.locations.get({
        name: locationName
      })
      return response.data
    } catch (error) {
      console.error('Error fetching business insights:', error)
      throw error
    }
  }
}
