"use strict";
/**
 * Main server entry point
 * Configures and starts the Fastify server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const cors_2 = require("./config/cors");
const routes_1 = require("./routes");
/**
 * Create and configure a Fastify server instance
 * @returns Configured FastifyInstance
 */
async function buildServer() {
    // Create Fastify instance with logging
    const server = (0, fastify_1.default)({
        logger: {
            level: env_1.env.APP_ENV === 'development' ? 'debug' : 'info',
            transport: env_1.env.APP_ENV === 'development'
                ? {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'SYS:standard',
                        ignore: 'pid,hostname',
                    },
                }
                : undefined,
        },
        trustProxy: true,
    });
    // Register plugins
    await server.register(cors_1.default, (0, cors_2.getCorsOptions)());
    await server.register(helmet_1.default, {
        contentSecurityPolicy: env_1.env.APP_ENV === 'production',
    });
    await server.register(rate_limit_1.default, {
        max: 100,
        timeWindow: '1 minute',
        allowList: ['127.0.0.1', 'localhost'],
    });
    // Register routes
    (0, routes_1.registerRoutes)(server);
    // Global error handler
    server.setErrorHandler((error, request, reply) => {
        logger_1.logger.error({
            error: error.message,
            path: request.url,
            method: request.method,
            stack: error.stack,
        }, 'Error processing request');
        // Send appropriate error response
        const statusCode = error.statusCode || 500;
        reply.status(statusCode).send({
            code: error.name || 'INTERNAL_ERROR',
            message: statusCode === 500 && env_1.env.APP_ENV === 'production'
                ? 'Internal server error'
                : error.message,
            details: error.validation || undefined,
        });
    });
    return server;
}
/**
 * Start the server
 * Separate from buildServer to facilitate testing
 */
async function startServer() {
    try {
        const server = await buildServer();
        // Start listening
        await server.listen({
            port: env_1.env.PORT,
            host: env_1.env.HOST,
        });
        logger_1.logger.info(`Server listening at ${env_1.env.HOST}:${env_1.env.PORT}`);
    }
    catch (err) {
        logger_1.logger.fatal(err);
        process.exit(1);
    }
}
// Start server if this file is run directly
if (require.main === module) {
    startServer();
}
