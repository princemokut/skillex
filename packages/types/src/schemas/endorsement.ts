/**
 * Endorsement schema definitions
 * Contains Zod schemas and TypeScript types for Endorsement entity
 */

import { z } from 'zod';

// Base Endorsement schema
export const endorsementSchema = z.object({
  id: z.string().uuid(),
  endorserId: z.string().uuid(),
  endorseeId: z.string().uuid(),
  tag: z.string().min(1).max(50),
  createdAt: z.date(),
});

// Schema for creating an endorsement
export const endorsementCreateSchema = endorsementSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for endorsement response
export const endorsementResponseSchema = endorsementSchema;

// TypeScript types derived from Zod schemas
export type Endorsement = z.infer<typeof endorsementSchema>;
export type EndorsementCreate = z.infer<typeof endorsementCreateSchema>;
export type EndorsementResponse = z.infer<typeof endorsementResponseSchema>;
