"use strict";
/**
 * Availability routes
 * Handles user availability operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = availabilityRoutes;
const zod_1 = require("zod");
const verify_1 = require("../auth/verify");
const prisma_1 = require("../lib/prisma");
const types_1 = require("@skillex/types");
/**
 * Register availability routes
 * @param fastify Fastify instance
 */
async function availabilityRoutes(fastify) {
    /**
     * GET /v1/availability
     * Get the current user's availability
     * Protected endpoint
     */
    fastify.get('/availability', {
        preHandler: [verify_1.authMiddleware],
        handler: async (request, reply) => {
            try {
                const userId = request.user?.id;
                if (!userId) {
                    return reply.status(401).send({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    });
                }
                // Fetch user availability from database
                const availability = await prisma_1.prisma.availability.findUnique({
                    where: { userId },
                });
                if (!availability) {
                    // Return default availability if not set yet
                    return {
                        userId,
                        weekMask: Array(168).fill(false),
                    };
                }
                // Validate response with schema
                return types_1.availabilityResponseSchema.parse(availability);
            }
            catch (error) {
                console.error('Error fetching user availability:', error);
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while fetching availability',
                });
            }
        },
    });
    /**
     * PUT /v1/availability
     * Update or create the current user's availability
     * Protected endpoint
     */
    fastify.put('/availability', {
        preHandler: [verify_1.authMiddleware],
        schema: {
            body: {
                type: 'object',
                required: ['weekMask'],
                properties: {
                    weekMask: {
                        type: 'array',
                        items: { type: 'boolean' },
                        minItems: 168,
                        maxItems: 168,
                    },
                },
            },
        },
        handler: async (request, reply) => {
            try {
                const userId = request.user?.id;
                if (!userId) {
                    return reply.status(401).send({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    });
                }
                // Validate with schema
                const availabilityData = types_1.availabilityUpdateSchema.parse(request.body);
                // Upsert availability in database (update if exists, create if not)
                const availability = await prisma_1.prisma.availability.upsert({
                    where: { userId },
                    create: {
                        userId,
                        weekMask: availabilityData.weekMask,
                    },
                    update: {
                        weekMask: availabilityData.weekMask,
                    },
                });
                // Return updated availability
                return types_1.availabilityResponseSchema.parse(availability);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return reply.status(400).send({
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid availability data',
                        details: error.format(),
                    });
                }
                console.error('Error updating availability:', error);
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while updating availability',
                });
            }
        },
    });
}
