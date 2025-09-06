# MyGoProfile - Google Business Profile Manager

A web application that connects to the Google Business Profile API to help you manage your business reviews and view insights.

## Features

- 🔐 Google OAuth 2.0 authentication
- 📊 View business accounts and locations
- ⭐ Manage Google Business Profile reviews
- 📈 View business insights and performance data
- 🎨 Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18 or higher
- Google Cloud Project with Business Profile API enabled
- Google OAuth 2.0 credentials

## Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Business Profile Performance API
   - My Business Business Information API
   - My Business Account Management API
   - My Business Notifications API
   - My Business Verifications API
   - My Business Q&A API

### 2. OAuth 2.0 Configuration

1. Go to "Credentials" in Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

### 3. Environment Variables

Copy `.env.local` and update the following variables:

```env
# Google OAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (for Vercel Postgres)
DATABASE_URL=postgresql://username:password@localhost:5432/mygoprofile

# Google Business Profile API
GOOGLE_BUSINESS_PROFILE_API_KEY=your-api-key-here
```

### 4. Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 5. Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## API Endpoints

- `GET /api/business/accounts` - Get business accounts
- `GET /api/business/locations?accountName={name}` - Get business locations
- `GET /api/business/reviews?locationName={name}` - Get reviews for a location

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js
- **API**: Google Business Profile API
- **Database**: PostgreSQL (Vercel Postgres)
- **Deployment**: Vercel

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **OAuth Error**: Make sure redirect URIs are correctly configured in Google Cloud Console
2. **API Access Denied**: Ensure the user has proper permissions for the business profile
3. **No Business Data**: Verify the Google account has access to business profiles

### Required Permissions

The application requires the following Google OAuth scopes:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/business.manage`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details