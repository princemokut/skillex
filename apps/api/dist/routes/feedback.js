"use strict";
/**
 * Feedback routes
 * Handles feedback operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = feedbackRoutes;
const verify_1 = require("../auth/verify");
/**
 * Register feedback routes
 * @param fastify Fastify instance
 */
async function feedbackRoutes(fastify) {
    /**
     * POST /v1/feedback
     * Submit feedback
     * Protected endpoint
     */
    fastify.post('/feedback', {
        preHandler: [verify_1.authMiddleware],
        handler: async (request, reply) => {
            try {
                // TODO: Implement feedback submission
                return {
                    message: 'Feedback submission not yet implemented',
                };
            }
            catch (error) {
                console.error('Error submitting feedback:', error);
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while submitting feedback',
                });
            }
        },
    });
}
