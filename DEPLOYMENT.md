# Firebase Deployment Guide

This guide will help you deploy your Skillex app to Firebase with the API on Cloud Run and the web app on Firebase Hosting.

## Prerequisites

1. **Firebase CLI**: `sudo npm install -g firebase-tools` (global tool)
2. **Google Cloud CLI**: `gcloud` installed and authenticated
3. **Docker**: For containerizing the API
4. **GitHub repository** with your code
5. **pnpm**: For project dependencies (already installed in your monorepo)

## Setup Steps

### 1. Firebase Project Setup

```bash
# Make sure you're in the project root
pwd  # Should show: /path/to/your/skillex

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Project: Create a new project or select existing
# - Public directory: apps/web/out
# - Single-page app: Yes
# - GitHub integration: Yes (optional)
```

### 2. Google Cloud Setup

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Environment Variables

Create the following files with your actual values:

#### `apps/web/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://your-api-url.run.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

#### `apps/api/.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://your-domain.web.app,https://your-domain.firebaseapp.com
PORT=3001
NODE_ENV=production
```

### 4. GitHub Secrets Setup

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

### **Required Secrets:**
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON (download from Firebase Console)
- `GCP_SA_KEY`: Google Cloud service account key JSON

### **API Environment Variables:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `SUPABASE_JWKS_URL`: Your Supabase JWKS URL (for JWT verification)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `RESEND_API_KEY`: (Optional) For email functionality

### **Frontend Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: (Optional) Your domain for analytics

### 5. Database Setup

Set up your PostgreSQL database (recommended: Supabase, Neon, or Google Cloud SQL):

1. Create a new PostgreSQL database
2. Update your `DATABASE_URL` in environment variables
3. Run migrations: `cd apps/api && pnpm prisma migrate deploy`

### 6. Deploy

#### Option A: Manual Deployment
```bash
# Run the deployment script
./scripts/deploy.sh
```

#### Option B: GitHub Actions (Recommended)
1. Push your code to the main branch
2. GitHub Actions will automatically:
   - Build and deploy the API to Cloud Run
   - Build and deploy the web app to Firebase Hosting

### 7. Post-Deployment

1. **Update CORS origins** in your API to include your Firebase hosting URL
2. **Test the deployment**:
   - Visit your Firebase hosting URL
   - Check API health: `https://your-api-url.run.app/health`
3. **Set up custom domain** (optional) in Firebase Console

## File Structure

```
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── apps/
│   ├── api/
│   │   ├── Dockerfile              # API containerization
│   │   └── .dockerignore
│   └── web/
│       ├── firebase.json           # Firebase hosting config
│       ├── .firebaserc            # Firebase project config
│       └── next.config.ts         # Next.js export config
├── scripts/deploy.sh              # Manual deployment script
└── DEPLOYMENT.md                  # This guide
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Check environment variables and dependencies
2. **API not accessible**: Verify CORS settings and Cloud Run permissions
3. **Web app not loading**: Check Firebase hosting configuration
4. **Database connection**: Verify DATABASE_URL and network access

### Useful Commands:

```bash
# Check Cloud Run logs
gcloud run logs read skillex-api --region=us-central1

# Check Firebase hosting logs
firebase hosting:channel:open live

# Test API locally
cd apps/api && pnpm dev

# Test web app locally
cd apps/web && pnpm dev
```

## Monitoring

- **API**: Google Cloud Console > Cloud Run
- **Web App**: Firebase Console > Hosting
- **Database**: Your database provider's dashboard
- **Logs**: Google Cloud Console > Logging

## Security Notes

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Enable authentication on your API endpoints
- Set up proper CORS policies
- Use HTTPS for all communications
