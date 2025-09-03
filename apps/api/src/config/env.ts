/**
 * Environment variable configuration module
 * Validates and parses environment variables with Zod
 */

import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

// Define schema for environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  
  // Auth
  SUPABASE_JWKS_URL: z.string().url(),
  
  // CORS
  ALLOWED_ORIGINS: z.string().min(1)
    .transform(val => val.split(',').map(origin => origin.trim())),
  
  // App environment
  APP_ENV: z.enum(['development', 'production']).default('development'),
  
  // Server
  PORT: z.coerce.number().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),
  
  // Email (optional)
  RESEND_API_KEY: z.string().optional(),
});

/**
 * Try to parse environment variables
 * Exit process if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validateEnv();
