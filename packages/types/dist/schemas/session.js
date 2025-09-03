"use strict";
/**
 * Session schema definitions
 * Contains Zod schemas and TypeScript types for Session entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionResponseSchema = exports.sessionUpdateSchema = exports.sessionCreateSchema = exports.sessionSchema = void 0;
const zod_1 = require("zod");
// Base Session schema
exports.sessionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cohortId: zod_1.z.string().uuid(),
    weekIndex: zod_1.z.number().int().min(0),
    startsAt: zod_1.z.date(),
    durationMinutes: zod_1.z.number().int().min(15).max(240).default(60),
    notesUrl: zod_1.z.string().url().optional(),
});
// Schema for creating a session
exports.sessionCreateSchema = exports.sessionSchema.omit({
    id: true
});
// Schema for updating a session
exports.sessionUpdateSchema = exports.sessionSchema.omit({
    id: true,
    cohortId: true
}).partial();
// Schema for session response
exports.sessionResponseSchema = exports.sessionSchema;
