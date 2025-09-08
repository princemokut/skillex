"use strict";
/**
 * Referral routes
 * Handles referral operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = referralRoutes;
const verify_1 = require("../auth/verify");
/**
 * Register referral routes
 * @param fastify Fastify instance
 */
async function referralRoutes(fastify) {
    /**
     * POST /v1/referrals
     * Create a referral
     * Protected endpoint
     */
    fastify.post('/referrals', {
        preHandler: [verify_1.authMiddleware],
        handler: async (request, reply) => {
            try {
                // TODO: Implement referral creation
                return {
                    message: 'Referral creation not yet implemented',
                };
            }
            catch (error) {
                console.error('Error creating referral:', error);
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while creating referral',
                });
            }
        },
    });
    /**
     * GET /v1/referrals
     * Get referrals
     * Protected endpoint
     */
    fastify.get('/referrals', {
        preHandler: [verify_1.authMiddleware],
        handler: async (request, reply) => {
            try {
                // TODO: Implement referral retrieval
                return {
                    message: 'Referral retrieval not yet implemented',
                };
            }
            catch (error) {
                console.error('Error fetching referrals:', error);
                reply.status(500).send({
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred while fetching referrals',
                });
            }
        },
    });
}
