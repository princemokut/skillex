# skillex

Cursor Build Brief — skillex API (Monorepo)

## Context
Build skillex, a professional social network similar to professional network/jobsites but centered on structured skill exchange. People list skills to teach/learn, get matched into 1:1 swaps or 4–5 person cohorts for 4–6 weeks, with sessions, chat, artifacts, feedback, endorsements, and referrals. It's open-source (Apache-2.0, DCO + CLA), with a hosted SaaS business, contextual ads/sponsorship (strict brand safety), and protected trademark ("skillex").

✅ Architecture (this task = backend API in a monorepo)

Location: /apps/api (Node.js + TypeScript, Fastify).

Prisma ORM + PostgreSQL (Supabase/Neon).

Auth: verify Supabase Auth JWT via JWKS; all non-public endpoints require Bearer token.

Validation: Zod for request/response schemas.

Security: CORS (allow configured origins), rate limiting, secure headers, input sanitation, structured logs.

Scheduling: daily matching suggestions + weekly reminders (CLI entrypoints; can be wired to any scheduler).

Open Source: Apache-2.0. Keep business logic server-side.

Keep the frontend decoupled. The API must be usable by any UI (Next.js on Cloud Run, a React SPA, mobile clients).

🗂️ Monorepo layout to create / enforce
/
  apps/
    api/                # Fastify service (this task)
    web/                # (placeholder) frontend lives here; do not modify in this task
  packages/
    types/              # shared Zod types & API DTOs
    config/             # tsconfig, eslint, prettier, jest/vitest base
  prisma/
    schema.prisma
    migrations/
    seed.ts
  package.json          # pnpm workspaces
  pnpm-workspace.yaml
  tsconfig.base.json


packages/config: export base ESLint/Prettier/TS configs used by apps/*.

packages/types: export Zod schemas & TypeScript types used by both API and Web (DTOs, enums).

🔧 Environment Configuration

All environment variables are centralized in the root `.env` file. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_JWKS_URL`: Supabase JWKS endpoint for JWT verification
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (for frontend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (for frontend)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

Both the API (`/apps/api`) and frontend (`/apps/web`) load environment variables from the root `.env` file for consistency.

📦 Dependencies

Core: fastify, @fastify/cors, @fastify/rate-limit, @fastify/helmet (or fastify-helmet alt), pino.

Auth: jsonwebtoken, jwks-rsa.

Validation: zod.

DB: prisma, @prisma/client.

Utils: dayjs, uuid.

Dev: tsx, typescript, eslint, prettier, vitest, supertest (or light-my-request), @types/*.

🔐 Environment variables (read from process.env)

DATABASE_URL — Postgres connection string

SUPABASE_JWKS_URL — e.g. https://<project>.supabase.co/auth/v1/keys

ALLOWED_ORIGINS — comma-separated list (e.g. https://app.skillex.dev,https://localhost:3000)

APP_ENV — development | production

RESEND_API_KEY — for transactional email (optional)

Create a small config module apps/api/src/config/env.ts that parses/validates envs with Zod.

🧱 Data model (Prisma)

Implement these models and relations in prisma/schema.prisma:

User: id (uuid), handle (unique), fullName, bio?, avatarUrl?, timezone, languages[], locationCity?, locationCountry?, createdAt

Connection: requester, addressee, status (pending/accepted/blocked), createdAt (unique pair)

Skill: userId, kind (teach|learn), tags[], level?, notes?, createdAt

Availability: userId (PK), weekMask (Boolean[168])

Cohort: id, title, ownerId, size (default 2), startDate, weeks (default 6), visibility (private/public), city?, createdAt

CohortMember: (cohortId, userId) PK, role (teacher/learner/facilitator), joinedAt

Session: id, cohortId, weekIndex, startsAt, durationMinutes (default 60), notesUrl?

Message: id, cohortId, userId, body, createdAt

Feedback: id, cohortId, fromUser, toUser, rating, text?, createdAt

Endorsement: id, endorser, endorsee, tag, createdAt

Referral: id, fromUser, toUser, context, status (draft/sent/accepted/declined), createdAt

Artifact: id, cohortId, url, kind (repo/doc/video/image/other), createdAt

Notification: id, userId, kind, payload (json), readAt?

Add indexes where appropriate (e.g., Message(cohortId, createdAt)).

🔌 API surface (MVP, versioned under /v1)

Health

GET /v1/health → { ok: true, version, timestamp } (public)

Auth

JWT middleware: verify Supabase token via JWKS; attach req.user (id, email, role).

GET /v1/me → current user profile (protected)

Users & Connections

GET /v1/users/:handle

PATCH /v1/users/:id (self) → bio, avatarUrl, languages, timezone, city

POST /v1/connections/requests → send request

POST /v1/connections/:id/accept

POST /v1/connections/:id/decline

GET /v1/connections?status=pending|accepted

Skills & Availability

GET /v1/skills/me

POST /v1/skills (kind=teach|learn, tags[], level?, notes?)

DELETE /v1/skills/:id

PUT /v1/availability (Boolean[168])

Matching

POST /v1/match/preview → returns top candidates and why (weights below)

Tag overlaps 50%

Level delta penalty 20%

Schedule overlap 20%

Locale proximity 10%

Expose CLI/HTTP job endpoints to run daily cohort suggestions

Cohorts & Sessions

POST /v1/cohorts (title, size, startDate, weeks, visibility, city)

POST /v1/cohorts/:id/members (role)

GET /v1/cohorts/:id

POST /v1/sessions (cohortId, weekIndex, startsAt, durationMinutes)

GET /v1/cohorts/:id/sessions

Chat (MVP)

POST /v1/cohorts/:id/messages

GET /v1/cohorts/:id/messages?cursor=...

Artifacts, Feedback, Endorsements, Referrals

POST /v1/cohorts/:id/artifacts

POST /v1/feedback

POST /v1/endorsements

POST /v1/referrals & POST /v1/referrals/:id/send

GET /v1/referrals?status=...

Ads hooks

Read-only context signals (e.g., skill tags, city) for the frontend to render clearly labelled sponsored components.

🧩 API project structure (/apps/api)
/apps/api
  src/
    config/
      env.ts           # loads & validates env (Zod)
      cors.ts          # uses ALLOWED_ORIGINS
      logger.ts        # pino instance
    auth/
      verify.ts        # JWKS fetch & JWT verify, attaches req.user
    schemas/           # Zod schemas for requests/responses
      user.ts, skill.ts, cohort.ts, match.ts, ...
    services/          # business logic
      matching.ts, referrals.ts, cohort.ts
    routes/            # route modules
      index.ts
      users.ts
      connections.ts
      skills.ts
      match.ts
      cohorts.ts
      sessions.ts
      messages.ts
      artifacts.ts
      feedback.ts
      referrals.ts
    jobs/
      matching.ts      # CLI handlers or minimal HTTP endpoints
      reminders.ts
    server.ts          # Fastify bootstrap; register plugins/routes
  package.json
  tsconfig.json


Conventions

All route handlers validate input/output with Zod.

Central error handler → consistent JSON errors { code, message, details? }.

Pino logs with request IDs.

Rate-limit high-risk routes (auth, connections, referrals, matching preview).

🧪 Testing

Unit: Vitest for services (matching, referrals).

API: Supertest or light-my-request for route tests.

Include one happy-path e2e: create users → add skills/availability → preview match → create cohort → add sessions → chat → feedback → referral.

🌱 Seed data (prisma/seed.ts)

Use @faker-js/faker to create ~20 users across time zones.

Generate avatar/cover URLs deterministically for demo (no uploads needed):

Avatars (DiceBear): https://api.dicebear.com/7.x/thumbs/svg?seed=<handle>&radius=50

Covers (Picsum): https://picsum.photos/seed/<handle>/1200/300

Pre-create one public cohort in Lagos with 4 members and 6 sessions (weekly).

🛠️ Scripts

At root package.json (pnpm workspaces):

"scripts": {
  "build": "pnpm -r build",
  "dev": "pnpm -C apps/api dev",
  "test": "pnpm -r test",
  "db:migrate": "prisma migrate deploy",
  "db:seed": "prisma db seed"
}


In /apps/api/package.json:

"scripts": {
  "dev": "tsx src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/server.js"
}

🔒 Acceptance criteria

GET /v1/health returns { ok: true }.

Auth middleware verifies Supabase JWT from Authorization: Bearer <token>; protected routes reject invalid tokens.

A user can: update profile; add skills & availability; get /v1/match/preview with scored "why match".

Cohort lifecycle works (create cohort → add members → create 6 sessions → post messages → upload artifact → submit feedback → send referral).

CORS only allows configured origins; rate-limits are active; logs are structured.

🚀 Notes on deployment later in this project:

The API binds to a single port from server.ts (e.g., 3000).

Scheduler can invoke node dist/jobs/matching.js and dist/jobs/reminders.js or hit minimal HTTP job endpoints.

No secrets in code; all via environment variables.

## Environment Setup

1. Copy `.env.example` to `.env` and update the values:
   ```
   # Database connection string
   DATABASE_URL="postgresql://postgres:password@localhost:5432/skillex?schema=public"
   
   # Supabase Auth JWKS URL
   SUPABASE_JWKS_URL="https://<project>.supabase.co/auth/v1/jwks"
   
   # CORS allowed origins (comma-separated)
   ALLOWED_ORIGINS="http://localhost:3000,https://app.skillex.dev"
   
   # App environment (development or production)
   APP_ENV="development"
   
   # Server port
   PORT=3000
   
   # Email (optional)
   # RESEND_API_KEY="re_123456789"
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Generate Prisma client:
   ```bash
   pnpm exec prisma generate
   ```

4. Set up the database:
   ```bash
   pnpm exec prisma migrate dev
   pnpm db:seed
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

- `apps/api` - Fastify API server
- `apps/web` - Frontend (placeholder)
- `packages/types` - Shared TypeScript types and Zod schemas
- `packages/config` - Shared configuration files
- `prisma` - Database schema and migrations

## API Endpoints

The API is versioned under `/v1` prefix.

### Public Endpoints

- `GET /v1/health` - Health check endpoint

### Protected Endpoints (require authentication)

- `GET /v1/me` - Get current user profile
- `PATCH /v1/users/:id` - Update user profile
- `GET /v1/users/:handle` - Get user by handle
- `POST /v1/connections/requests` - Send connection request
- `POST /v1/connections/:id/accept` - Accept connection request
- `POST /v1/connections/:id/decline` - Decline connection request
- `GET /v1/connections` - List user connections

... (and many more as described in the specifications)

## Authentication

All protected endpoints require a valid JWT token from Supabase Auth, provided in the Authorization header:

```
Authorization: Bearer <token>
```

## License

Apache-2.0