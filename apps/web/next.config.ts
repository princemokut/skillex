import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../..', // Set root for pnpm monorepo
  experimental: {
    outputFileTracingRoot: '../..', // Alternative configuration
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api-url.run.app'
  }
};

export default nextConfig;
