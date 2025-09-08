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

# Install dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Copy API source code
COPY apps/api/ ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["pnpm", "start"]
