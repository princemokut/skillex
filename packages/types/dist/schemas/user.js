"use strict";
/**
 * User schema definitions
 * Contains Zod schemas and TypeScript types for User entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponseSchema = exports.userUpdateSchema = exports.userCreateSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// Base User schema
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    handle: zod_1.z.string().min(3).max(30),
    fullName: zod_1.z.string().min(2).max(100),
    bio: zod_1.z.string().max(500).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    timezone: zod_1.z.string(),
    languages: zod_1.z.array(zod_1.z.string()),
    locationCity: zod_1.z.string().optional(),
    locationCountry: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
});
// Schema for creating a user
exports.userCreateSchema = exports.userSchema.omit({
    id: true,
    createdAt: true
});
// Schema for updating a user
exports.userUpdateSchema = exports.userSchema.omit({
    id: true,
    handle: true,
    createdAt: true
}).partial();
// Schema for user response
exports.userResponseSchema = exports.userSchema;
