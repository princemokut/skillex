/**
 * Connection schema definitions
 * Contains Zod schemas and TypeScript types for Connection entity
 */

import { z } from 'zod';

// Connection status enum
export const ConnectionStatus = z.enum(['pending', 'accepted', 'blocked']);
export type ConnectionStatus = z.infer<typeof ConnectionStatus>;

// Base Connection schema
export const connectionSchema = z.object({
  id: z.string().uuid(),
  requesterId: z.string().uuid(),
  addresseeId: z.string().uuid(),
  status: ConnectionStatus,
  createdAt: z.date(),
});

// Schema for creating a connection
export const connectionCreateSchema = connectionSchema.omit({ 
  id: true, 
  createdAt: true,
  status: true 
}).extend({
  status: z.literal('pending').optional().default('pending'),
});

// Schema for updating a connection
export const connectionUpdateSchema = z.object({
  status: ConnectionStatus,
});

// Schema for connection response
export const connectionResponseSchema = connectionSchema;

// TypeScript types derived from Zod schemas
export type Connection = z.infer<typeof connectionSchema>;
export type ConnectionCreate = z.infer<typeof connectionCreateSchema>;
export type ConnectionUpdate = z.infer<typeof connectionUpdateSchema>;
export type ConnectionResponse = z.infer<typeof connectionResponseSchema>;
