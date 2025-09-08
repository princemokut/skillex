"use strict";
/**
 * JWT verification module
 * Verifies Supabase Auth JWTs via JWKS
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
exports.authMiddleware = authMiddleware;
const jwt = __importStar(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
// Set up JWKS client
const jwks = (0, jwks_rsa_1.default)({
    jwksUri: env_1.env.SUPABASE_JWKS_URL,
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
async function getSigningKey(header) {
    if (!header.kid) {
        throw new Error('JWT header missing kid (key ID)');
    }
    const key = await jwks.getSigningKey(header.kid);
    return key.getPublicKey();
}
/**
 * Verify JWT token from Authorization header
 * Extracts the user ID and attaches to request.user
 * @param req Fastify request object
 * @param reply Fastify reply object
 * @returns Promise resolving if token is valid, rejecting otherwise
 */
async function verifyJWT(req, reply) {
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
        const payload = jwt.verify(token, signingKey);
        // Check required claims
        if (!payload.sub) {
            throw new Error('JWT missing required claims');
        }
        // Attach user info to request
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
    catch (error) {
        logger_1.logger.error({
            error: error.message,
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
async function authMiddleware(req, reply) {
    await verifyJWT(req, reply);
}
