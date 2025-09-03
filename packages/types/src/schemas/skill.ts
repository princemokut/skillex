/**
 * Skill schema definitions
 * Contains Zod schemas and TypeScript types for Skill entity
 */

import { z } from 'zod';

// Skill kind enum
export const SkillKind = z.enum(['teach', 'learn']);
export type SkillKind = z.infer<typeof SkillKind>;

// Skill level enum
export const SkillLevel = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
export type SkillLevel = z.infer<typeof SkillLevel>;

// Base Skill schema
export const skillSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  kind: SkillKind,
  tags: z.array(z.string()),
  level: SkillLevel.optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.date(),
});

// Schema for creating a skill
export const skillCreateSchema = skillSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for updating a skill
export const skillUpdateSchema = skillSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial();

// Schema for skill response
export const skillResponseSchema = skillSchema;

// TypeScript types derived from Zod schemas
export type Skill = z.infer<typeof skillSchema>;
export type SkillCreate = z.infer<typeof skillCreateSchema>;
export type SkillUpdate = z.infer<typeof skillUpdateSchema>;
export type SkillResponse = z.infer<typeof skillResponseSchema>;
