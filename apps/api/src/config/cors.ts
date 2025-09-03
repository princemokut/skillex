/**
 * CORS configuration
 * Sets up Cross-Origin Resource Sharing for the API
 */

import { FastifyCorsOptions } from '@fastify/cors';
import { env } from './env';

/**
 * Configure CORS options based on environment variables
 * @returns FastifyCorsOptions object for @fastify/cors plugin
 */
export function getCorsOptions(): FastifyCorsOptions {
  return {
    origin: env.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };
}
