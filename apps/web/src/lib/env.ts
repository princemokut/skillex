/**
 * Environment configuration for the skillex frontend
 * Validates and provides access to environment variables
 */

import { z } from 'zod';

/**
 * Parse raw env vars first; we'll enforce requirements based on NODE_ENV.
 */
const baseSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE: z.string().url().optional(),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

  // Analytics (optional)
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});

const raw = baseSchema.parse({
  NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
});

const isProduction = process.env.NODE_ENV === 'production';

function requireInProduction(name: string, value: string | undefined, fallback?: string): string {
  if (isProduction) {
    if (!value || value.includes('placeholder')) {
      throw new Error(`Missing required environment variable ${name} in production.`);
    }
    return value;
  }
  return value ?? fallback ?? '';
}

/**
 * Validated environment variables
 * In production, placeholders are NOT allowed.
 * In development, sensible fallbacks are provided for convenience.
 */
export const env = {
  NEXT_PUBLIC_API_BASE: requireInProduction(
    'NEXT_PUBLIC_API_BASE',
    raw.NEXT_PUBLIC_API_BASE,
    'http://localhost:8080',
  ),
  NEXT_PUBLIC_SUPABASE_URL: requireInProduction(
    'NEXT_PUBLIC_SUPABASE_URL',
    raw.NEXT_PUBLIC_SUPABASE_URL,
    'https://placeholder.supabase.co',
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requireInProduction(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    raw.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'placeholder_key',
  ),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: raw.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
} as const;

/**
 * API configuration
 */
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_BASE,
  endpoints: {
    auth: '/v1/auth',
    users: '/v1/users',
    skills: '/v1/skills',
    availability: '/v1/availability',
    matches: '/v1/match',
    cohorts: '/v1/cohorts',
    connections: '/v1/connections',
    referrals: '/v1/referrals',
    endorsements: '/v1/endorsements',
    feedback: '/v1/feedback',
    messages: '/v1/messages',
    artifacts: '/v1/artifacts',
    sessions: '/v1/sessions',
    health: '/v1/health',
  },
} as const;

/**
 * Supabase configuration
 */
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

/**
 * Analytics configuration
 */
export const analyticsConfig = {
  plausibleDomain: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  enabled: !!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
} as const;
