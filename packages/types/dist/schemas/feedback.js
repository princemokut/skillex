"use strict";
/**
 * Feedback schema definitions
 * Contains Zod schemas and TypeScript types for Feedback entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackResponseSchema = exports.feedbackCreateSchema = exports.feedbackSchema = void 0;
const zod_1 = require("zod");
// Base Feedback schema
exports.feedbackSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cohortId: zod_1.z.string().uuid(),
    fromUserId: zod_1.z.string().uuid(),
    toUserId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    text: zod_1.z.string().max(1000).optional(),
    createdAt: zod_1.z.date(),
});
// Schema for creating feedback
exports.feedbackCreateSchema = exports.feedbackSchema.omit({
    id: true,
    createdAt: true
});
// Schema for feedback response
exports.feedbackResponseSchema = exports.feedbackSchema;
