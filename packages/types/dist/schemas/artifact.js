"use strict";
/**
 * Artifact schema definitions
 * Contains Zod schemas and TypeScript types for Artifact entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifactResponseSchema = exports.artifactCreateSchema = exports.artifactSchema = exports.ArtifactKind = void 0;
const zod_1 = require("zod");
// Artifact kind enum
exports.ArtifactKind = zod_1.z.enum(['repo', 'doc', 'video', 'image', 'other']);
// Base Artifact schema
exports.artifactSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cohortId: zod_1.z.string().uuid(),
    url: zod_1.z.string().url(),
    kind: exports.ArtifactKind,
    createdAt: zod_1.z.date(),
});
// Schema for creating an artifact
exports.artifactCreateSchema = exports.artifactSchema.omit({
    id: true,
    createdAt: true
});
// Schema for artifact response
exports.artifactResponseSchema = exports.artifactSchema;
