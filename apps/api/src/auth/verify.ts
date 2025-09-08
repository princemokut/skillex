/**
 * JWT verification module
 * Verifies Supabase Auth JWTs via JWKS
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { env } from '../config/env';
import { logger } from '../config/logger';

// Set up JWKS client
const jwks = jwksClient({
  jwksUri: env.SUPABASE_JWKS_URL,
  cache: true,
  cacheMaxAge: 3600000, // 1 hour
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

/**
 * Get signing key from JWKS
 * @param header JWT header containing kid
 * @returns Promise resolving to the signing key
 */
async function getSigningKey(header: jwt.JwtHeader): Promise<string> {
  if (!header.kid) {
    throw new Error('JWT header missing kid (key ID)');
  }
  
  const key = await jwks.getSigningKey(header.kid);
  return key.getPublicKey();
}

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
export async function verifyJWT(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Invalid Authorization token format');
    }
    
    // Decode token without verification to get header with kid
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || typeof decoded !== 'object' || !decoded.header) {
      throw new Error('Invalid JWT token');
    }
    
    // Get signing key from JWKS
    const signingKey = await getSigningKey(decoded.header);
    
    // Verify and decode token
    const payload = jwt.verify(token, signingKey) as jwt.JwtPayload;
    
    // Check required claims
    if (!payload.sub) {
      throw new Error('JWT missing required claims');
    }
    
    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email as string,
      role: payload.role as string | undefined,
    };
    
  } catch (error) {
    logger.error({ 
      error: (error as Error).message,
      path: req.url,
      method: req.method,
    }, 'Auth error');
    
    reply.status(401).send({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token',
    });
  }
}

/**
 * Authentication middleware for Fastify routes
 * Checks for a valid JWT in Authorization header
 * @param req Fastify request object
 * @param reply Fastify reply object
 */
export async function authMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  await verifyJWT(req, reply);
}
