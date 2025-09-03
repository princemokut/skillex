/**
 * Route registration
 * Configures and registers all API routes
 */

import { FastifyInstance } from 'fastify';
import healthRoutes from './health';
import userRoutes from './users';
import connectionRoutes from './connections';
import skillRoutes from './skills';
import matchRoutes from './match';
import cohortRoutes from './cohorts';
import sessionRoutes from './sessions';
import messageRoutes from './messages';
import artifactRoutes from './artifacts';
import feedbackRoutes from './feedback';
import endorsementRoutes from './endorsements';
import referralRoutes from './referrals';

/**
 * Register all API routes with the Fastify instance
 * @param server Fastify server instance
 */
export function registerRoutes(server: FastifyInstance): void {
  // API version prefix
  const prefix = '/v1';
  
  // Register route modules
  server.register(healthRoutes, { prefix });
  server.register(userRoutes, { prefix });
  server.register(connectionRoutes, { prefix });
  server.register(skillRoutes, { prefix });
  server.register(matchRoutes, { prefix });
  server.register(cohortRoutes, { prefix });
  server.register(sessionRoutes, { prefix });
  server.register(messageRoutes, { prefix });
  server.register(artifactRoutes, { prefix });
  server.register(feedbackRoutes, { prefix });
  server.register(endorsementRoutes, { prefix });
  server.register(referralRoutes, { prefix });
}
