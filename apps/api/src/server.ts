/**
 * Main server entry point
 * Configures and starts the Fastify server
 */

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { logger } from './config/logger';
import { getCorsOptions } from './config/cors';
import { registerRoutes } from './routes';

/**
 * Create and configure a Fastify server instance
 * @returns Configured FastifyInstance
 */
export async function buildServer(): Promise<FastifyInstance> {
  // Create Fastify instance with logging
  const server = Fastify({
    logger,
    trustProxy: true,
  });
  
  // Register plugins
  await server.register(cors, getCorsOptions());
  
  await server.register(helmet, {
    contentSecurityPolicy: env.APP_ENV === 'production',
  });
  
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', 'localhost'],
  });
  
  // Register routes
  registerRoutes(server);
  
  // Global error handler
  server.setErrorHandler((error, request, reply) => {
    logger.error({ 
      error: error.message,
      path: request.url,
      method: request.method,
      stack: error.stack,
    }, 'Error processing request');
    
    // Send appropriate error response
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      code: error.name || 'INTERNAL_ERROR',
      message: statusCode === 500 && env.APP_ENV === 'production'
        ? 'Internal server error'
        : error.message,
      details: error.validation || undefined,
    });
  });
  
  return server;
}

/**
 * Start the server
 * Separate from buildServer to facilitate testing
 */
async function startServer(): Promise<void> {
  try {
    const server = await buildServer();
    
    // Start listening
    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });
    
    logger.info(`Server listening at ${env.HOST}:${env.PORT}`);
    
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
