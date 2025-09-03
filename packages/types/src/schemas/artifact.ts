/**
 * Artifact schema definitions
 * Contains Zod schemas and TypeScript types for Artifact entity
 */

import { z } from 'zod';

// Artifact kind enum
export const ArtifactKind = z.enum(['repo', 'doc', 'video', 'image', 'other']);
export type ArtifactKind = z.infer<typeof ArtifactKind>;

// Base Artifact schema
export const artifactSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  url: z.string().url(),
  kind: ArtifactKind,
  createdAt: z.date(),
});

// Schema for creating an artifact
export const artifactCreateSchema = artifactSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for artifact response
export const artifactResponseSchema = artifactSchema;

// TypeScript types derived from Zod schemas
export type Artifact = z.infer<typeof artifactSchema>;
export type ArtifactCreate = z.infer<typeof artifactCreateSchema>;
export type ArtifactResponse = z.infer<typeof artifactResponseSchema>;
