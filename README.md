# BWG Listing Hub API

A complete property listing management system for the BWG team, built with Node.js, Express, and Supabase.

## Features

✅ **Complete REST API** - Create, read, update, delete listings
✅ **AI Auto-Matching** - Automatically match listings with buyer/tenant enquiries
✅ **Photo Management** - Upload and manage property photos
✅ **Team Management** - Manage team members and roles
✅ **Group Organization** - Separate BWG and TRR groups
✅ **Production Ready** - Deployed on Vercel with Supabase

## Quick Start

### Local Development

\`\`\`bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Server will be available at http://localhost:3000
\`\`\`

### Test API

\`\`\`bash
# Health check
curl http://localhost:3000/api/health

# Get all listings
curl http://localhost:3000/api/listings

# Create a listing
curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3BR Apartment",
    "listing_type": "subsale",
    "property_type": "apartment",
    "location": "Johor Bahru",
    "price": 450000,
    "bedrooms": 3,
    "bathrooms": 2,
    "group": "BWG",
    "user_id": "test-user-1"
  }'
\`\`\`

## Deployment

### Prerequisites

1. **GitHub Account** - https://github.com
2. **Supabase Project** - https://supabase.com
3. **Vercel Account** - https://vercel.com

### Deploy Steps

1. **Create GitHub Repository**
   - New repo named \`bwg-listing-hub-api\`
   - Upload all files

2. **Run Supabase Setup**
   - Copy SQL from \`bwg_supabase_schema.sql\`
   - Run in Supabase SQL Editor
   - Create \`listing-photos\` storage bucket

3. **Deploy to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Add Environment Variables:
     - \`SUPABASE_URL\`
     - \`SUPABASE_KEY\`
   - Click Deploy

4. **Test Deployment**
   \`\`\`bash
   curl https://your-domain.vercel.app/api/health
   \`\`\`

See \`ONE_CLICK_DEPLOY.md\` for detailed steps.

## API Endpoints

### Listings
- \`GET /api/listings\` - Get all listings
- \`GET /api/listings/:id\` - Get single listing
- \`POST /api/listings\` - Create listing
- \`PATCH /api/listings/:id\` - Update listing
- \`DELETE /api/listings/:id\` - Delete listing
- \`POST /api/listings/:id/upload-photo\` - Upload photo
- \`GET /api/listings/:id/photos\` - Get listing photos

### Buyer Enquiries
- \`GET /api/buyer-enquiries\` - Get all enquiries
- \`POST /api/buyer-enquiries\` - Create enquiry
- \`PATCH /api/buyer-enquiries/:id\` - Update enquiry

### AI Matches
- \`GET /api/matches\` - Get all matches
- \`POST /api/matches/trigger\` - Trigger AI matching
- \`PATCH /api/matches/:id/notify\` - Mark as notified

## Environment Variables

\`\`\`
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
PORT=3000
NODE_ENV=production
\`\`\`

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **Language**: JavaScript

## Project Structure

\`\`\`
bwg-listing-hub-api/
├── bwg_api_server.js           # Main API server
├── package.json                # Dependencies
├── vercel.json                 # Vercel config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── bwg_supabase_schema.sql    # Database schema
├── ONE_CLICK_DEPLOY.md        # Deployment guide
└── QUICK_START.md             # Quick start guide
\`\`\`

## Support

For detailed setup instructions, see:
- \`QUICK_START.md\` - 30-minute setup guide
- \`DEPLOYMENT_GUIDE.md\` - Complete deployment guide
- \`ONE_CLICK_DEPLOY.md\` - One-click deployment steps

## License

MIT

---

**Ready to deploy?** Follow \`ONE_CLICK_DEPLOY.md\` for step-by-step instructions! 🚀
