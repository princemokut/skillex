"use strict";
/**
 * Route registration
 * Configures and registers all API routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const health_1 = __importDefault(require("./health"));
const users_1 = __importDefault(require("./users"));
const connections_1 = __importDefault(require("./connections"));
const skills_1 = __importDefault(require("./skills"));
const match_1 = __importDefault(require("./match"));
const cohorts_1 = __importDefault(require("./cohorts"));
const sessions_1 = __importDefault(require("./sessions"));
const messages_1 = __importDefault(require("./messages"));
const artifacts_1 = __importDefault(require("./artifacts"));
const feedback_1 = __importDefault(require("./feedback"));
const endorsements_1 = __importDefault(require("./endorsements"));
const referrals_1 = __importDefault(require("./referrals"));
/**
 * Register all API routes with the Fastify instance
 * @param server Fastify server instance
 */
function registerRoutes(server) {
    // API version prefix
    const prefix = '/v1';
    // Register route modules
    server.register(health_1.default, { prefix });
    server.register(users_1.default, { prefix });
    server.register(connections_1.default, { prefix });
    server.register(skills_1.default, { prefix });
    server.register(match_1.default, { prefix });
    server.register(cohorts_1.default, { prefix });
    server.register(sessions_1.default, { prefix });
    server.register(messages_1.default, { prefix });
    server.register(artifacts_1.default, { prefix });
    server.register(feedback_1.default, { prefix });
    server.register(endorsements_1.default, { prefix });
    server.register(referrals_1.default, { prefix });
}
