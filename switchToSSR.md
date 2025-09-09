Prompt for Cursor: switch to SSR “standalone” & prep for realtime/LiveKit

A single instruction for Cursor. It assumes a monorepo with /apps/web (Next.js) and that you’ll deploy Next on Cloud Run. It also prepares stubs for WS and LiveKit so future chat/video work is smooth.

Project context
We’re building Skillex—a popular professional network tool with a skill-exchange niche. Authenticated app: connections, referrals, cohorts with weekly sessions, chat, artifacts, endorsements. Soon we’ll add realtime chat/presence, first-party video calls (via LiveKit), and an AI coach. Only the marketing homepage may be static; all core pages are authenticated & dynamic.

Goal
Migrate the Next.js app to SSR (no static export) with output: 'standalone', dockerize /apps/web, and prep the codebase for:

WebSockets/SSE (chat, presence)

LiveKit integration (envs, server token minting, client hook)

Correct caching for auth’d pages (no accidental SSG/ISR)

Tasks

Next.js config

In /apps/web/next.config.ts:

Remove output: 'export' if present.

Add output: 'standalone'.

Keep App Router features; enable server actions if needed.

For authenticated routes (app/* except marketing):

Default to SSR; add export const revalidate = 0; or use fetch(..., { cache: 'no-store' }).

For routes depending on cookies/session, add export const dynamic = 'force-dynamic'.

Auth middleware

Add /apps/web/middleware.ts that:

Reads Supabase session cookie (or our auth provider).

Redirects unauthenticated users to /signin for protected paths (e.g., /referrals/**, /cohorts/**, /messages/**), but allows /, /signin, /privacy, /terms.

Dockerize Next (standalone)

Create /apps/web/Dockerfile:

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml package.json ./
# If monorepo, also copy the relevant workspaces manifests
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app/apps/web
COPY apps/web ./
# If you share UI packages, copy them too:
# COPY packages/ui packages/ui
RUN pnpm build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    HOSTNAME=0.0.0.0
# Copy the standalone output + public assets
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public
EXPOSE 8080
CMD ["node", "server.js"]


Ensure production start works locally: docker build then docker run -p 8080:8080.

Environment variables

Add to /apps/web/.env.example and read via process.env:

NEXT_PUBLIC_API_BASE

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_LIVEKIT_WS_URL (eg. wss://your-livekit-host)

LIVEKIT_API_KEY, LIVEKIT_API_SECRET (server-side only)

Optional TURN: TURN_URIS, TURN_USERNAME, TURN_CREDENTIAL

LiveKit scaffolding

In backend API (Fastify), add a minimal POST /v1/video/token:

Verifies the user’s JWT.

Uses LIVEKIT_API_KEY/SECRET to mint a JoinToken with room permissions (publisher/subscriber).

In web, add lib/livekit.ts:

A client helper to fetch the server-minted token and call connect to NEXT_PUBLIC_LIVEKIT_WS_URL. Include a hook useLiveKitRoom(roomName).

Leave placeholders for webhooks (attendance, recordings) to be handled in the API.

Realtime prep (chat/presence)

Create a small realtime client util in web (SSE or WS ready), but don’t open a socket yet.

Add feature flags so we can switch chat on per-cohort later.

Caching & headers

For authenticated pages, ensure all fetch calls use no-store or route config uses revalidate = 0.

Ensure _next/static/** gets long-term cache; dynamic routes are not cached.

CI/CD notes (you can generate the YAML later)

Build the /apps/web Docker image and deploy to Cloud Run.

Set min instances to reduce cold starts (1–2). Port 8080.

Acceptance criteria

No use of output: 'export'; app runs as a standalone server.

Authenticated routes render at request time; no build-time path generation required.

/apps/web builds into a runnable Docker image exposing 8080.

lib/livekit.ts exists with a connect helper and config reads from env.

API exposes /v1/video/token (spec + stubs in place).

Middleware protects app routes; marketing pages remain public.

The site works locally in Docker and is deployable to Cloud Run.







# ROADMAP for dev guidance
aiming for chat, first-party video calls, and AI coaching, the safest “build-for-tomorrow” plan is:

Best-practice architecture (now → scale)
1) Frontend (Next.js, all auth’d pages)

Run Next.js as a “standalone” Node server (not static export) so you can use:

SSR/RSC, server actions, streaming

WebSockets/SSE and custom middlewares

Where to run: Cloud Run (recommended) with min instances ≥ 1–2 to avoid cold starts.

Static/marketing root page: you can still serve it from the same Next app. If you want a tiny, cache-heavy marketing site, keep it on Firebase Hosting or Cloudflare Pages and link to the app domain.

Why not Firebase Hosting (Frameworks) for the app? It’s fine for SSR, but once you add long-lived connections (WS/WebRTC signaling), custom runtime knobs, and heavier server logic, the standalone server on Cloud Run gives you headroom and simpler ops.

Checklist

next.config.{js,ts}: remove output: 'export'; add output: 'standalone'.

Dockerize /apps/web (Next standalone output) → deploy to Cloud Run.

Optional: keep Firebase Hosting as a CDN/proxy with a rewrite to your Cloud Run service for dynamic routes (zero SEO change), while _next/static/** is cached aggressively.

2) Core API (Fastify + Prisma + Postgres/Supabase)

Keep as a separate service on Cloud Run.

JWT auth via Supabase JWKS as you already do.

Enable CORS for your app domain(s).

Add Cloud Armor (basic WAF) + p95 latency SLOs as you grow.

3) Real-time messaging & presence (new service)

Create a realtime-gateway service:

WebSocket server (Fastify WS / uWebSockets.js / Socket.IO).

Run on Cloud Run (WS supported) or Fly.io Machines (great for sticky connections).

Redis (Memorystore) for presence & pub/sub fan-out; persist messages to Postgres async.

Rate-limit per connection; backpressure; auth via short-lived signed tokens from your API.

4) Video calls (own, trackable)

Don’t reinvent the SFU. Use a proven WebRTC SFU:

LiveKit (best developer UX): start with LiveKit Cloud for speed, then self-host on GKE Autopilot when you want full control.

Alternatives: Jitsi, mediasoup, Janus (more DIY).

Run coturn (STUN/TURN) yourself or use a managed TURN (static IPs for NAT traversal).

Use webhooks/egress APIs to:

mark attendance (who joined, how long),

trigger recordings to Cloud Storage,

emit “session happened” events to your analytics.

5) AI coach service

Separate ai-coach worker:

Stateless HTTP or queue-driven worker (Cloud Run jobs / Pub/Sub + Cloud Run).

Use external LLMs now; move to your own inference (vLLM on GPU) later if needed.

RAG over your skill modules & cohort artifacts; store embeddings in Postgres (pgvector) or a vector DB.

Add rate limiting and cost metering per user/cohort.

6) Events, jobs, notifications

Event bus: Google Pub/Sub (or NATS if you prefer self-host) for fan-out between services.

Background jobs: Cloud Run Jobs or Pub/Sub + worker service.

Notifications:

In-app: via WS gateway.

Email: Resend (already in your env list) or SES.

Push: Web Push (VAPID) or FCM.

7) Data model & scale notes

Chat: partition messages by room_id (cohort or 1:1), composite index (room_id, created_at).

Video: persist session summaries (start/end, participants, durations, recording URL).

Referrals/Endorsements: keep as you modeled; add soft-delete flags.

Prisma: add read replicas later (Supabase supports it); consider connection pooling (pgBouncer) via Supabase config.

Analytics: append-only events table, BigQuery export later if needed.

8) Security, privacy, moderation

E2EE optional for calls (LiveKit supports), but balance with recording/analytics needs.

CSP/Headers on Next server; helmet on API and WS gateway.

Abuse controls: rate limits, invite gating, spam detectors on chat/DM/referrals.

Observability: OpenTelemetry → Cloud Monitoring, Sentry for errors, pino logs.

How to roll it out (no throwaway work)
Phase A — switch web to standalone (1–2 days)

Next.js standalone build → Dockerfile → Cloud Run.

Point app.yourdomain.com to Cloud Run (or keep Firebase Hosting as proxy).

Verify SSR, cookies, dynamic = 'force-dynamic' where needed; remove static export.

Phase B — add realtime (2–4 days)

Spin up realtime-gateway WS service on Cloud Run; integrate auth & Redis presence.

UI: switch chat/cohort pages to WS; fall back to polling if disconnected.

Phase C — add video (start with managed, then own)

Integrate LiveKit Cloud for pilot cohorts (fastest). Track attendance via webhooks.

When ready, self-host LiveKit on GKE Autopilot; add coturn; store recordings in Cloud Storage.

Phase D — AI coach

Ship ai-coach worker that calls external LLMs; store session transcripts.

Add RAG over cohort artifacts; rate-limit & meter cost.

Dev/ops guardrails that prevent rewrites

Monorepo with /apps/web (Next), /apps/api, /apps/realtime, /apps/ai-coach, /packages/types.

GitHub Actions pipelines:

Build & deploy each service to Cloud Run on changes to its path.

Infra via OpenTofu/Terraform or Pulumi when you’re ready.

API versioning: /v1/*, typed DTOs in @skillex/types.

Feature flags: simple DB toggles for chat/video/AI rollouts.

TL;DR choices you asked me to make

Yes: Next.js on Cloud Run standalone now (not Hosting for the app).

Yes: Separate WS gateway service.

Yes: Use a WebRTC SFU (LiveKit → self-host later), with TURN and webhooks.

Yes: AI coach as its own worker service.

Keep: Supabase Postgres/Auth; your Fastify API.

Marketing root page can be static anywhere; everything else SSR/auth’d.

When usage spikes, scale by turning up instances/regions and splitting services, not by rewriting core architecture.