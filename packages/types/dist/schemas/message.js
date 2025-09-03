"use strict";
/**
 * Message schema definitions
 * Contains Zod schemas and TypeScript types for Message entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedMessagesSchema = exports.messageResponseSchema = exports.messageCreateSchema = exports.messageSchema = void 0;
const zod_1 = require("zod");
// Base Message schema
exports.messageSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cohortId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    body: zod_1.z.string().min(1).max(2000),
    createdAt: zod_1.z.date(),
});
// Schema for creating a message
exports.messageCreateSchema = exports.messageSchema.omit({
    id: true,
    createdAt: true
});
// Schema for message response
exports.messageResponseSchema = exports.messageSchema;
// Schema for paginated messages
exports.paginatedMessagesSchema = zod_1.z.object({
    messages: zod_1.z.array(exports.messageResponseSchema),
    cursor: zod_1.z.string().optional(),
    hasMore: zod_1.z.boolean(),
});
