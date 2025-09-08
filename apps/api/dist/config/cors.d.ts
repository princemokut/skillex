/**
 * CORS configuration
 * Sets up Cross-Origin Resource Sharing for the API
 */
import { FastifyCorsOptions } from '@fastify/cors';
/**
 * Configure CORS options based on environment variables
 * @returns FastifyCorsOptions object for @fastify/cors plugin
 */
export declare function getCorsOptions(): FastifyCorsOptions;
