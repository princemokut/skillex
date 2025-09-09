# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS base
WORKDIR /repo
RUN corepack enable

# 1) Install workspace deps at repo root (pnpm workspaces)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
# Include workspace package manifests so pnpm can resolve workspace:* deps
COPY packages/types/package.json packages/types/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile

# 2) Build Next.js (standalone)
FROM base AS build
COPY . .
# Make sure node_modules from deps are available during build
COPY --from=deps /repo/node_modules /repo/node_modules
RUN pnpm -C apps/web build

# 3) Minimal runtime using Next standalone output
FROM node:20-bookworm-slim AS run
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# (Optional hardening) run as non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone server (includes pruned node_modules) + static + public
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/public ./public

USER nextjs

# Cloud Run default PORT is 8080 — let the platform set it
EXPOSE 8080
CMD ["node", "apps/web/server.js"]

# Why this fixes it
# Uses Next “standalone” output, so the runtime image includes only what’s needed (no bulky node_modules copy).
# No hard-coded PORT; Cloud Run injects PORT (defaults to 8080). Your previous 8081 caused the crash.
# Debian base avoids Alpine’s common native-lib pitfalls.