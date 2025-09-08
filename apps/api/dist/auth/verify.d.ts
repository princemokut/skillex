/**
 * JWT verification module
 * Verifies Supabase Auth JWTs via JWKS
 */
import { FastifyRequest, FastifyReply } from 'fastify';
/**
 * User information extracted from JWT
 */
export interface AuthUser {
    id: string;
    email: string;
    role?: string;
}
/**
 * Extend FastifyRequest with user property
 */
declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
    }
}
/**
 * Verify JWT token from Authorization header
 * Extracts the user ID and attaches to request.user
 * @param req Fastify request object
 * @param reply Fastify reply object
 * @returns Promise resolving if token is valid, rejecting otherwise
 */
export declare function verifyJWT(req: FastifyRequest, reply: FastifyReply): Promise<void>;
/**
 * Authentication middleware for Fastify routes
 * Checks for a valid JWT in Authorization header
 * @param req Fastify request object
 * @param reply Fastify reply object
 */
export declare function authMiddleware(req: FastifyRequest, reply: FastifyReply): Promise<void>;
