import { google } from 'googleapis'

export class GoogleBusinessAPI {
  private oauth2Client: any

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
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client
      })

      const response = await mybusinessbusinessinformation.accounts.locations.reviews.list({
        parent: locationName
      })
      return response.data
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
