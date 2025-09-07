/**
 * Session schema definitions
 * Contains Zod schemas and TypeScript types for Session entity
 */

import { z } from 'zod';

// Base Session schema
export const sessionSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  weekIndex: z.number().int().min(0),
  startsAt: z.date(),
  durationMinutes: z.number().int().min(15).max(240).default(60),
  notesUrl: z.string().url().optional(),
  attendeeCount: z.number().int().min(0).default(0),
});

// Schema for creating a session
export const sessionCreateSchema = sessionSchema.omit({ 
  id: true
});

// Schema for updating a session
export const sessionUpdateSchema = sessionSchema.omit({ 
  id: true, 
  cohortId: true 
}).partial();

// Schema for session response
export const sessionResponseSchema = sessionSchema;

// TypeScript types derived from Zod schemas
export type Session = z.infer<typeof sessionSchema>;
export type SessionCreate = z.infer<typeof sessionCreateSchema>;
export type SessionUpdate = z.infer<typeof sessionUpdateSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
