"use strict";
/**
 * Prisma client singleton
 * Provides a single instance of PrismaClient to be used across the application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
    return new client_1.PrismaClient();
};
// Export the client, reusing an existing instance if available
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
// In production, don't set the global variable to avoid memory leaks
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
