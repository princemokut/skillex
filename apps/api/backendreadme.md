# skillex API — backend implementation notes

This file contains the detailed backend brief and implementation notes that previously lived in the root `README.md`.

> Note: The root `README.md` is now streamlined for open‑source onboarding. See this file for API specifics.

## Monorepo architecture (API focus)

- Location: `apps/api` (Node.js + TypeScript, Fastify)
- ORM/DB: Prisma + PostgreSQL (Supabase/Neon)
- Auth: Verify Supabase Auth JWT via JWKS; protected routes require Bearer token
- Validation: Zod for request/response schemas
- Security: CORS, rate limiting, secure headers, input sanitation, structured logs
- Scheduling: CLI entrypoints for matching and reminders jobs

## Environment configuration

All env vars are read from the root `.env` file. Required:

- `DATABASE_URL`
- `SUPABASE_JWKS_URL`
- `ALLOWED_ORIGINS`
- Optional: `RESEND_API_KEY`, `APP_ENV`

## Data model (Prisma)

Key entities: User, Connection, Skill, Availability, Cohort, CohortMember, Session, Message, Feedback, Endorsement, Referral, Artifact, Notification. Add indexes as appropriate.

## API surface (MVP, versioned under /v1)

- Health: `GET /v1/health` (public)
- Users & Connections: profiles, requests, accept/decline, list
- Skills & Availability: CRUD + weekly availability
- Matching: `POST /v1/match/preview` returns candidates with scoring rationale
- Cohorts & Sessions: create/join cohorts, list/create sessions
- Chat: post/list messages (MVP)
- Artifacts, Feedback, Endorsements, Referrals: create/list flows

## Project structure (API)

```
apps/api
  src/
    config/ (env, cors, logger)
    auth/ (verify.ts)
    schemas/ (zod)
    services/
    routes/
    jobs/
    server.ts
  package.json
  tsconfig.json
```

## Conventions

- Validate all inputs/outputs with Zod
- Central error handler → `{ code, message, details? }`
- Pino logs with request IDs
- Rate‑limit high‑risk routes

## Testing

- Unit: Vitest for services (matching, referrals)
- API: Supertest or light‑my‑request
- E2E happy path covering profile → skills/availability → match → cohort → sessions → chat → feedback → referral

## Seed data

- Use `@faker-js/faker` to generate ~20 users across time zones
- Deterministic avatar/cover URLs for demo
- Pre‑create a public cohort (example)

## Scripts

Root `package.json` (pnpm workspaces):

```
{"build":"pnpm -r build","dev":"pnpm -C apps/api dev","test":"pnpm -r test","db:migrate":"prisma migrate deploy","db:seed":"prisma db seed"}
```

In `apps/api/package.json`:

```
{"dev":"tsx src/server.ts","build":"tsc -p tsconfig.json","start":"node dist/server.js"}
```

## Deployment notes

- Single port from `server.ts` (e.g., 3000)
- Jobs via `node dist/jobs/*.js` or minimal HTTP endpoints
- No secrets in code; use environment variables

## License

Apache‑2.0
