# skillex

Professional skill‑exchange platform. Monorepo with API and Web apps. Open‑source (Apache‑2.0).

## Packages

- `apps/api`: Fastify + TypeScript API (Prisma + Postgres, JWT via Supabase JWKS)
- `apps/web`: Next.js 14 App Router (SSR, Tailwind, shadcn/ui)
- `packages/types`: Shared Zod schemas & TypeScript types
- `packages/config`: Shared ESLint/Prettier/TS configs

## Quick start

1) Install deps
```
pnpm install
```

2) Environment
```
cp .env.example .env
# set DATABASE_URL, SUPABASE_JWKS_URL, NEXT_PUBLIC_* and ALLOWED_ORIGINS
```

3) Dev servers
```
pnpm -C apps/api dev         # API (default http://localhost:8080 or configured PORT)
pnpm -C apps/web dev -p 3000 # Web http://localhost:3000
```

## Deploy

GitHub Actions builds and deploys each app to Google Cloud Run.
- Images pushed to Artifact Registry
- Web runs as Next.js standalone; API as Fastify service

See `.github/workflows/deploy.yml` and `DEPLOYMENT.md`.

## Security & Auth

- API: Bearer JWT verified via Supabase JWKS
- Web: Supabase auth (cookies) + Next middleware for protected routes

## Contributing

Contributions welcome! Please:
- Open an issue for significant changes
- Follow code style; run lint and tests
- Keep PRs focused and add tests where relevant

## Code of Conduct

This project follows the Contributor Covenant.

## License

Apache‑2.0

## More docs

- Backend implementation details: `apps/api/backendreadme.md`