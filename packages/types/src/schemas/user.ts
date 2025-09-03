/**
 * User schema definitions
 * Contains Zod schemas and TypeScript types for User entity
 */

import { z } from 'zod';

// Base User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  handle: z.string().min(3).max(30),
  fullName: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  timezone: z.string(),
  languages: z.array(z.string()),
  locationCity: z.string().optional(),
  locationCountry: z.string().optional(),
  createdAt: z.date(),
});

// Schema for creating a user
export const userCreateSchema = userSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Schema for updating a user
export const userUpdateSchema = userSchema.omit({ 
  id: true, 
  handle: true,
  createdAt: true 
}).partial();

// Schema for user response
export const userResponseSchema = userSchema;

// TypeScript types derived from Zod schemas
export type User = z.infer<typeof userSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
