/**
 * Cohort schema definitions
 * Contains Zod schemas and TypeScript types for Cohort entity
 */

import { z } from 'zod';

// Cohort visibility enum
export const CohortVisibility = z.enum(['private', 'public']);
export type CohortVisibility = z.infer<typeof CohortVisibility>;

// Base Cohort schema
export const cohortSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  ownerId: z.string().uuid(),
  size: z.number().int().min(2).default(2),
  startDate: z.date(),
  weeks: z.number().int().min(1).max(24).default(6),
  visibility: CohortVisibility.default('private'),
  city: z.string().optional(),
  createdAt: z.date(),
});

// Schema for creating a cohort
export const cohortCreateSchema = cohortSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for updating a cohort
export const cohortUpdateSchema = cohortSchema.omit({ 
  id: true, 
  ownerId: true,
  createdAt: true 
}).partial();

// Schema for cohort response
export const cohortResponseSchema = cohortSchema;

// Member role enum
export const MemberRole = z.enum(['teacher', 'learner', 'facilitator']);
export type MemberRole = z.infer<typeof MemberRole>;

// Cohort member schema
export const cohortMemberSchema = z.object({
  cohortId: z.string().uuid(),
  userId: z.string().uuid(),
  role: MemberRole,
  joinedAt: z.date(),
});

// Schema for adding a member to a cohort
export const cohortMemberCreateSchema = cohortMemberSchema.omit({ 
  joinedAt: true 
});

// TypeScript types derived from Zod schemas
export type Cohort = z.infer<typeof cohortSchema>;
export type CohortCreate = z.infer<typeof cohortCreateSchema>;
export type CohortUpdate = z.infer<typeof cohortUpdateSchema>;
export type CohortResponse = z.infer<typeof cohortResponseSchema>;

export type CohortMember = z.infer<typeof cohortMemberSchema>;
export type CohortMemberCreate = z.infer<typeof cohortMemberCreateSchema>;
