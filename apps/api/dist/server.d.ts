/**
 * Main server entry point
 * Configures and starts the Fastify server
 */
import { FastifyInstance } from 'fastify';
/**
 * Create and configure a Fastify server instance
 * @returns Configured FastifyInstance
 */
export declare function buildServer(): Promise<FastifyInstance>;
