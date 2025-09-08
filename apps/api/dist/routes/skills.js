"use strict";
/**
 * Skills routes
 * Handles user skills operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = skillRoutes;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const verify_1 = require("../auth/verify");
const logger_1 = require("../config/logger");
const types_1 = require("@skillex/types");
// Create Prisma client instance
const prisma = new client_1.PrismaClient();
/**
 * Register skills routes
 * @param fastify Fastify instance
 */
async function skillRoutes(fastify) {
    /**
     * GET /v1/skills/me
     * Get the current user's skills
     * Protected endpoint
     */
    fastify.get('/skills/me', {
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
                // Fetch user skills from database
                const skills = await prisma.skill.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                });
                // Validate response with schema
                return { skills: skills.map(skill => types_1.skillResponseSchema.parse(skill)) };
            }
            catch (error) {
                logger_1.logger.error({ error }, 'Error fetching user skills');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while fetching skills',
                });
            }
        },
    });
    /**
     * POST /v1/skills
     * Create a new skill for the current user
     * Protected endpoint
     */
    fastify.post('/skills', {
        preHandler: [verify_1.authMiddleware],
        schema: {
            body: {
                type: 'object',
                required: ['kind', 'tags'],
                properties: {
                    kind: { type: 'string', enum: ['teach', 'learn'] },
                    tags: { type: 'array', items: { type: 'string' } },
                    level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
                    notes: { type: 'string', maxLength: 500 },
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
                const skillData = types_1.skillCreateSchema.parse({
                    ...request.body,
                    userId,
                });
                // Create skill in database
                const skill = await prisma.skill.create({
                    data: skillData,
                });
                // Return created skill
                return types_1.skillResponseSchema.parse(skill);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return reply.status(400).send({
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid skill data',
                        details: error.format(),
                    });
                }
                logger_1.logger.error({ error }, 'Error creating skill');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while creating skill',
                });
            }
        },
    });
    /**
     * DELETE /v1/skills/:id
     * Delete a user skill
     * Protected endpoint
     */
    fastify.delete('/skills/:id', {
        preHandler: [verify_1.authMiddleware],
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string', format: 'uuid' },
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
                const { id } = request.params;
                // Find the skill
                const skill = await prisma.skill.findUnique({
                    where: { id },
                });
                if (!skill) {
                    return reply.status(404).send({
                        code: 'NOT_FOUND',
                        message: 'Skill not found',
                    });
                }
                // Check if the user owns the skill
                if (skill.userId !== userId) {
                    return reply.status(403).send({
                        code: 'FORBIDDEN',
                        message: 'You can only delete your own skills',
                    });
                }
                // Delete the skill
                await prisma.skill.delete({
                    where: { id },
                });
                return { success: true };
            }
            catch (error) {
                logger_1.logger.error({ error }, 'Error deleting skill');
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while deleting skill',
                });
            }
        },
    });
}
