/**
 * Logger configuration
 * Sets up structured logging with pino
 */

import pino from 'pino';
import { env } from './env';

// Configure logger based on environment
const isDevelopment = env.APP_ENV === 'development';

/**
 * Create configured pino logger instance
 */
export const logger = pino({
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
