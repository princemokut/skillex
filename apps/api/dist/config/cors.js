"use strict";
/**
 * CORS configuration
 * Sets up Cross-Origin Resource Sharing for the API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOptions = getCorsOptions;
const env_1 = require("./env");
/**
 * Configure CORS options based on environment variables
 * @returns FastifyCorsOptions object for @fastify/cors plugin
 */
function getCorsOptions() {
    return {
        origin: env_1.env.ALLOWED_ORIGINS,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        maxAge: 86400, // 24 hours
    };
}
