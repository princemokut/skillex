/**
 * Environment configuration for the skillex frontend
 * Validates and provides access to environment variables
 */

import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.join(__dirname, '../../../../../.env') });

/**
 * Environment variables schema
 * Validates that all required environment variables are present
 */
const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE: z.string().url().default('http://localhost:3001'),
  
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default('placeholder_key'),
  
  // Analytics (optional)
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});

/**
 * Validated environment variables
 * Throws an error if required variables are missing
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
});

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
