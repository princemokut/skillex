This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloud Run (SSR standalone)

This app runs as a Next.js SSR server with `output: 'standalone'` and is deployed on Google Cloud Run.

Basic steps:

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

Ensure environment variables are set (see `DEPLOYMENT.md`).
