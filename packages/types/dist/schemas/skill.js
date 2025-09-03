"use strict";
/**
 * Skill schema definitions
 * Contains Zod schemas and TypeScript types for Skill entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillResponseSchema = exports.skillUpdateSchema = exports.skillCreateSchema = exports.skillSchema = exports.SkillLevel = exports.SkillKind = void 0;
const zod_1 = require("zod");
// Skill kind enum
exports.SkillKind = zod_1.z.enum(['teach', 'learn']);
// Skill level enum
exports.SkillLevel = zod_1.z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
// Base Skill schema
exports.skillSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    kind: exports.SkillKind,
    tags: zod_1.z.array(zod_1.z.string()),
    level: exports.SkillLevel.optional(),
    notes: zod_1.z.string().max(500).optional(),
    createdAt: zod_1.z.date(),
});
// Schema for creating a skill
exports.skillCreateSchema = exports.skillSchema.omit({
    id: true,
    createdAt: true
});
// Schema for updating a skill
exports.skillUpdateSchema = exports.skillSchema.omit({
    id: true,
    userId: true,
    createdAt: true
}).partial();
// Schema for skill response
exports.skillResponseSchema = exports.skillSchema;
