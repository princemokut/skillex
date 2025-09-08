"use strict";
/**
 * User routes
 * Handles user profile operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const verify_1 = require("../auth/verify");
const logger_1 = require("../config/logger");
const types_1 = require("@skillex/types");
// Create Prisma client instance
const prisma = new client_1.PrismaClient();
/**
 * Register user routes
 * @param fastify Fastify instance
 */
async function userRoutes(fastify) {
    /**
     * GET /v1/me
     * Get the current user's profile
     * Protected endpoint
     */
    fastify.get('/me', {
        preHandler: [verify_1.authMiddleware],
        handler: async (request, reply) => {
            try {
                // User ID comes from JWT token
                const userId = request.user?.id;
                if (!userId) {
                    return reply.status(401).send({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    });
                }
                // Fetch user from database
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return reply.status(404).send({
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    });
                }
                // Validate response with schema
                return types_1.userResponseSchema.parse(user);
            }
            catch (error) {
                logger_1.logger.error({ error }, 'Error fetching user profile');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while fetching user profile',
                });
            }
        },
    });
    /**
     * GET /v1/users/:handle
     * Get a user's profile by handle
     */
    fastify.get('/users/:handle', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    handle: { type: 'string' },
                },
                required: ['handle'],
            },
        },
        handler: async (request, reply) => {
            try {
                const { handle } = request.params;
                // Fetch user from database
                const user = await prisma.user.findUnique({
                    where: { handle },
                });
                if (!user) {
                    return reply.status(404).send({
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    });
                }
                // Validate response with schema
                return types_1.userResponseSchema.parse(user);
            }
            catch (error) {
                logger_1.logger.error({ error }, 'Error fetching user by handle');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while fetching user profile',
                });
            }
        },
    });
    /**
     * PATCH /v1/users/:id
     * Update a user's profile (self only)
     * Protected endpoint
     */
    fastify.patch('/users/:id', {
        preHandler: [verify_1.authMiddleware],
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            },
            body: {
                type: 'object',
                properties: {
                    bio: { type: 'string', maxLength: 500 },
                    avatarUrl: { type: 'string', format: 'uri' },
                    languages: { type: 'array', items: { type: 'string' } },
                    timezone: { type: 'string' },
                    locationCity: { type: 'string' },
                    locationCountry: { type: 'string' },
                },
            },
        },
        handler: async (request, reply) => {
            try {
                // User ID comes from JWT token
                const authUserId = request.user?.id;
                const { id: targetUserId } = request.params;
                // Only allow users to update their own profile
                if (authUserId !== targetUserId) {
                    return reply.status(403).send({
                        code: 'FORBIDDEN',
                        message: 'You can only update your own profile',
                    });
                }
                // Validate update data with schema
                const updateData = types_1.userUpdateSchema.parse(request.body);
                // Update user in database
                const updatedUser = await prisma.user.update({
                    where: { id: targetUserId },
                    data: updateData,
                });
                // Validate response with schema
                return types_1.userResponseSchema.parse(updatedUser);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return reply.status(400).send({
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid user data',
                        details: error.format(),
                    });
                }
                logger_1.logger.error({ error }, 'Error updating user profile');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while updating user profile',
                });
            }
        },
    });
}
