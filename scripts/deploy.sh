#!/bin/bash

# Deploy script for Skillex app
set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root"
    exit 1
fi

# Deploy API to Cloud Run
echo "📦 Deploying API to Cloud Run..."
docker build -f apps/api/Dockerfile -t gcr.io/$PROJECT_ID/skillex-api:latest .
docker push gcr.io/$PROJECT_ID/skillex-api:latest

gcloud run deploy skillex-api \
  --image gcr.io/$PROJECT_ID/skillex-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# Get the API URL
API_URL=$(gcloud run services describe skillex-api --region=us-central1 --format="value(status.url)")
echo "✅ API deployed at: $API_URL"

# Deploy Web App to Firebase Hosting
echo "🌐 Deploying Web App to Firebase Hosting..."
cd ../web

# Set the API URL for build
export NEXT_PUBLIC_API_URL=$API_URL

# Build the app
pnpm build

# Deploy to Firebase
firebase deploy --only hosting

echo "🎉 Deployment complete!"
echo "API URL: $API_URL"
echo "Web App: Check Firebase Console for hosting URL"
