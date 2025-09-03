/**
 * Availability schema definitions
 * Contains Zod schemas and TypeScript types for Availability entity
 */

import { z } from 'zod';

// Base Availability schema
export const availabilitySchema = z.object({
  userId: z.string().uuid(),
  // weekMask is an array of 168 booleans (24 hours * 7 days)
  // Each value represents a 1-hour slot in the week, starting from Monday 00:00
  weekMask: z.array(z.boolean()).length(168),
});

// Schema for updating availability
export const availabilityUpdateSchema = z.object({
  weekMask: z.array(z.boolean()).length(168),
});

// Schema for availability response
export const availabilityResponseSchema = availabilitySchema;

// TypeScript types derived from Zod schemas
export type Availability = z.infer<typeof availabilitySchema>;
export type AvailabilityUpdate = z.infer<typeof availabilityUpdateSchema>;
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;
