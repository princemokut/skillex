/**
 * Health check routes
 * Provides endpoints for health monitoring
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

/**
 * Health check response schema
 */
const healthResponseSchema = z.object({
  ok: z.boolean(),
  version: z.string(),
  timestamp: z.string(),
});

/**
 * Register health check routes
 * @param fastify Fastify instance
 */
export default async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /v1/health
   * Public health check endpoint
   */
  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            version: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
    handler: async () => {
      // Get package version from package.json
      const version = process.env.npm_package_version || '0.1.0';
      
      return {
        ok: true,
        version,
        timestamp: new Date().toISOString(),
      };
    },
  });
}
