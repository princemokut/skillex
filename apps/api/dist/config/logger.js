"use strict";
/**
 * Logger configuration
 * Sets up structured logging with pino
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_1 = require("./env");
// Configure logger based on environment
const isDevelopment = env_1.env.APP_ENV === 'development';
/**
 * Create configured pino logger instance
 */
exports.logger = (0, pino_1.default)({
    level: isDevelopment ? 'debug' : 'info',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    base: undefined,
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
});
