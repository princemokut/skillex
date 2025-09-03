"use strict";
/**
 * Endorsement schema definitions
 * Contains Zod schemas and TypeScript types for Endorsement entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.endorsementResponseSchema = exports.endorsementCreateSchema = exports.endorsementSchema = void 0;
const zod_1 = require("zod");
// Base Endorsement schema
exports.endorsementSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    endorserId: zod_1.z.string().uuid(),
    endorseeId: zod_1.z.string().uuid(),
    tag: zod_1.z.string().min(1).max(50),
    createdAt: zod_1.z.date(),
});
// Schema for creating an endorsement
exports.endorsementCreateSchema = exports.endorsementSchema.omit({
    id: true,
    createdAt: true
});
// Schema for endorsement response
exports.endorsementResponseSchema = exports.endorsementSchema;
