# Cloud Run Deployment Guide (API + Web SSR)

This guide shows how to deploy both the API and the Next.js web app (SSR, standalone) to Google Cloud Run.

## Prerequisites

1. **Google Cloud CLI**: `gcloud` installed and authenticated
2. **Docker**: For building container images
3. **GitHub repository** with your code
4. **pnpm**: For monorepo dependencies

## Google Cloud Setup

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

Optionally create an Artifact Registry repository (recommended):
```bash
gcloud artifacts repositories create skillex-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Skillex containers"
```

## Environment Variables

Create the following files with your actual values:

#### `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_BASE=https://your-api-url.run.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

#### `apps/api/.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_JWKS_URL=https://<project>.supabase.co/auth/v1/keys
ALLOWED_ORIGINS=https://app.your-domain.com
RESEND_API_KEY=optional_re_...
PORT=8080
NODE_ENV=production
```

## GitHub Secrets (CI/CD)

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_SA_KEY`: Service account key JSON with Cloud Run + Artifact Registry permissions
- `GAR_LOCATION`: Artifact Registry location (e.g., `us-central1`)
- `GAR_REPOSITORY`: Artifact Registry repo name (e.g., `skillex-repo`)
- App envs as needed (e.g., `DATABASE_URL`, `SUPABASE_JWKS_URL`, `ALLOWED_ORIGINS`, `NEXT_PUBLIC_*`)

## Database Setup

Use Supabase, Neon, or Cloud SQL:
1. Create a PostgreSQL database
2. Update `DATABASE_URL`
3. Run migrations: `cd apps/api && pnpm prisma migrate deploy`

## Build & Deploy

### API (Cloud Run)

```bash
# From repo root
docker build -f apps/api/Dockerfile -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-api:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-api:latest

gcloud run deploy skillex-api \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Web (Next.js SSR, Cloud Run)

Ensure `apps/web/next.config.ts` uses `output: 'standalone'` and dynamic pages are SSR.

```bash
# From repo root
docker build -f apps/web/Dockerfile -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-web:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-web:latest

gcloud run deploy skillex-web \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/skillex-repo/skillex-web:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances=1
```

## Post-Deployment

1. **CORS**: Update API `ALLOWED_ORIGINS` to include your web service URL
2. **Health checks**: `https://<api-service>.<region>.run.app/v1/health`
3. **Custom domains**: Map `app.your-domain.com` to the `skillex-web` Cloud Run service
4. **Secrets**: Prefer Cloud Run service-level env vars or Secret Manager

## File Structure

```
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── apps/
│   ├── api/
│   │   ├── Dockerfile              # API containerization
│   │   └── .dockerignore
│   └── web/
│       ├── Dockerfile              # Web (Next.js SSR) containerization
│       └── next.config.ts          # Next.js SSR standalone config
├── scripts/deploy.sh               # Optional manual deployment script
└── DEPLOYMENT.md                   # This guide
```

## Troubleshooting

### Common Issues

1. **Build fails**: Verify env vars and lockfile; ensure `output: 'standalone'` for web
2. **API not accessible**: Check Cloud Run IAM, VPC egress, and CORS settings
3. **Web routing issues**: Confirm port `8080`, SSR route configs, and base URLs
4. **Database**: Verify `DATABASE_URL` networking and migrations

### Useful Commands

```bash
# Logs (replace service/region)
gcloud run services describe skillex-api --region=us-central1 | cat
gcloud run services describe skillex-web --region=us-central1 | cat
gcloud run logs read skillex-api --region=us-central1
gcloud run logs read skillex-web --region=us-central1

# Local dev
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

## Monitoring

- **API**: Cloud Run service `skillex-api`
- **Web App**: Cloud Run service `skillex-web`
- **Database**: Provider dashboard (Supabase/Neon/Cloud SQL)
- **Logs & Metrics**: Google Cloud Console > Logging / Monitoring

## Security Notes

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Enable authentication on your API endpoints
- Set up proper CORS policies
- Use HTTPS for all communications
