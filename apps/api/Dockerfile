# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages directory
COPY packages/ ./packages/

# Copy API package files
COPY apps/api/package.json ./apps/api/

# Copy TypeScript config files
COPY tsconfig.base.json ./

# Install dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Copy API source code
COPY apps/api/ ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Build the application
RUN pnpm build

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Start the application
CMD ["pnpm", "start"]
