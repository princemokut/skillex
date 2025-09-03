/**
 * Message schema definitions
 * Contains Zod schemas and TypeScript types for Message entity
 */

import { z } from 'zod';

// Base Message schema
export const messageSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  userId: z.string().uuid(),
  body: z.string().min(1).max(2000),
  createdAt: z.date(),
});

// Schema for creating a message
export const messageCreateSchema = messageSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for message response
export const messageResponseSchema = messageSchema;

// Schema for paginated messages
export const paginatedMessagesSchema = z.object({
  messages: z.array(messageResponseSchema),
  cursor: z.string().optional(),
  hasMore: z.boolean(),
});

// TypeScript types derived from Zod schemas
export type Message = z.infer<typeof messageSchema>;
export type MessageCreate = z.infer<typeof messageCreateSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type PaginatedMessages = z.infer<typeof paginatedMessagesSchema>;
