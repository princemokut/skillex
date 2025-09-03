/**
 * Prisma client singleton
 * Provides a single instance of PrismaClient to be used across the application
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Define a global type for PrismaClient
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Export the client, reusing an existing instance if available
export const prisma = globalThis.prisma ?? prismaClientSingleton();

// In production, don't set the global variable to avoid memory leaks
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
