"use strict";
/**
 * Connection schema definitions
 * Contains Zod schemas and TypeScript types for Connection entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionResponseSchema = exports.connectionUpdateSchema = exports.connectionCreateSchema = exports.connectionSchema = exports.ConnectionStatus = void 0;
const zod_1 = require("zod");
// Connection status enum
exports.ConnectionStatus = zod_1.z.enum(['pending', 'accepted', 'blocked']);
// Base Connection schema
exports.connectionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    requesterId: zod_1.z.string().uuid(),
    addresseeId: zod_1.z.string().uuid(),
    status: exports.ConnectionStatus,
    createdAt: zod_1.z.date(),
});
// Schema for creating a connection
exports.connectionCreateSchema = exports.connectionSchema.omit({
    id: true,
    createdAt: true,
    status: true
}).extend({
    status: zod_1.z.literal('pending').optional().default('pending'),
});
// Schema for updating a connection
exports.connectionUpdateSchema = zod_1.z.object({
    status: exports.ConnectionStatus,
});
// Schema for connection response
exports.connectionResponseSchema = exports.connectionSchema;
