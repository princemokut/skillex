"use strict";
/**
 * Cohort schema definitions
 * Contains Zod schemas and TypeScript types for Cohort entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cohortMemberCreateSchema = exports.cohortMemberSchema = exports.MemberRole = exports.cohortResponseSchema = exports.cohortUpdateSchema = exports.cohortCreateSchema = exports.cohortSchema = exports.CohortVisibility = void 0;
const zod_1 = require("zod");
// Cohort visibility enum
exports.CohortVisibility = zod_1.z.enum(['private', 'public']);
// Base Cohort schema
exports.cohortSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(3).max(100),
    ownerId: zod_1.z.string().uuid(),
    size: zod_1.z.number().int().min(2).default(2),
    startDate: zod_1.z.date(),
    weeks: zod_1.z.number().int().min(1).max(24).default(6),
    visibility: exports.CohortVisibility.default('private'),
    city: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
});
// Schema for creating a cohort
exports.cohortCreateSchema = exports.cohortSchema.omit({
    id: true,
    createdAt: true
});
// Schema for updating a cohort
exports.cohortUpdateSchema = exports.cohortSchema.omit({
    id: true,
    ownerId: true,
    createdAt: true
}).partial();
// Schema for cohort response
exports.cohortResponseSchema = exports.cohortSchema;
// Member role enum
exports.MemberRole = zod_1.z.enum(['teacher', 'learner', 'facilitator']);
// Cohort member schema
exports.cohortMemberSchema = zod_1.z.object({
    cohortId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    role: exports.MemberRole,
    joinedAt: zod_1.z.date(),
});
// Schema for adding a member to a cohort
exports.cohortMemberCreateSchema = exports.cohortMemberSchema.omit({
    joinedAt: true
});
