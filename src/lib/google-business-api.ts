import { google } from 'googleapis'

export class GoogleBusinessAPI {
  private oauth2Client: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2()
    this.oauth2Client.setCredentials({
      access_token: accessToken
    })
  }

  // Get business accounts using Google Business Profile Account Management API
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
      throw new Error(`Failed to fetch business accounts: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get business locations using Google Business Profile Business Information API
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
      throw new Error(`Failed to fetch business locations: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get reviews for a location - Note: Reviews might be in a different API
  async getReviews(locationName: string) {
    try {
      // For now, we'll try the Business Information API
      // If this doesn't work, we may need to use a different API for reviews
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client
      })

      // Try to get location details first to see if reviews are available
      await mybusinessbusinessinformation.accounts.locations.get({
        name: locationName
      })

      // For now, return empty reviews array with a note
      // The actual reviews API might be different or require additional permissions
      return {
        reviews: [],
        note: 'Reviews API integration pending - may require additional Google Business Profile API permissions'
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Return empty reviews instead of throwing error to keep the app functional
      return {
        reviews: [],
        error: `Reviews temporarily unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
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
      throw new Error(`Failed to fetch business insights: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
