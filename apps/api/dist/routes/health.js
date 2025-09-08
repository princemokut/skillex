"use strict";
/**
 * Health check routes
 * Provides endpoints for health monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
const zod_1 = require("zod");
/**
 * Health check response schema
 */
const healthResponseSchema = zod_1.z.object({
    ok: zod_1.z.boolean(),
    version: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
/**
 * Register health check routes
 * @param fastify Fastify instance
 */
async function healthRoutes(fastify) {
    /**
     * GET /v1/health
     * Public health check endpoint
     */
    fastify.get('/health', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        version: { type: 'string' },
                        timestamp: { type: 'string' },
                    },
                },
            },
        },
        handler: async () => {
            // Get package version from package.json
            const version = process.env.npm_package_version || '0.1.0';
            return {
                ok: true,
                version,
                timestamp: new Date().toISOString(),
            };
        },
    });
}
