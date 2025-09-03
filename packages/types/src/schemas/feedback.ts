/**
 * Feedback schema definitions
 * Contains Zod schemas and TypeScript types for Feedback entity
 */

import { z } from 'zod';

// Base Feedback schema
export const feedbackSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional(),
  createdAt: z.date(),
});

// Schema for creating feedback
export const feedbackCreateSchema = feedbackSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for feedback response
export const feedbackResponseSchema = feedbackSchema;

// TypeScript types derived from Zod schemas
export type Feedback = z.infer<typeof feedbackSchema>;
export type FeedbackCreate = z.infer<typeof feedbackCreateSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
