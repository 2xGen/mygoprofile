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
      console.log('Attempting to fetch business accounts...')
      const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessaccountmanagement.accounts.list()
      console.log('Business accounts response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching business accounts:', error)
      
      // Handle quota exceeded error specifically
      if (error instanceof Error && error.message.includes('Quota exceeded')) {
        return {
          accounts: [],
          error: 'API quota exceeded. Please wait a few minutes and try again.',
          quotaExceeded: true
        }
      }
      
      // Return empty array instead of throwing to keep app functional
      return {
        accounts: [],
        error: `Failed to fetch business accounts: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Get business locations using Google Business Profile Business Information API
  async getBusinessLocations(accountName: string) {
    try {
      console.log('Attempting to fetch business locations for account:', accountName)
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessbusinessinformation.accounts.locations.list({
        parent: accountName,
        readMask: 'name,displayName,websiteUri,primaryPhone,address'
      })
      console.log('Business locations response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching business locations:', error)
      // Return empty array instead of throwing to keep app functional
      return {
        locations: [],
        error: `Failed to fetch business locations: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Get reviews for a location - Note: Reviews might be in a different API
  async getReviews(_locationName: string) {
    try {
      // For now, return empty reviews array with a note
      // The actual reviews API might be different or require additional permissions
      // Google Business Profile reviews may require a different API endpoint
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
  async getBusinessInsights(_locationName: string) {
    try {
      // For now, return mock insights data
      // The actual insights API might require different permissions or endpoints
      return {
        insights: {
          totalViews: 0,
          totalClicks: 0,
          totalCalls: 0,
          totalDirectionRequests: 0,
          note: 'Insights API integration pending - may require additional Google Business Profile API permissions'
        }
      }
    } catch (error) {
      console.error('Error fetching business insights:', error)
      throw new Error(`Failed to fetch business insights: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
