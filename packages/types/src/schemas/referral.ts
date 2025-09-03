/**
 * Referral schema definitions
 * Contains Zod schemas and TypeScript types for Referral entity
 */

import { z } from 'zod';

// Referral status enum
export const ReferralStatus = z.enum(['draft', 'sent', 'accepted', 'declined']);
export type ReferralStatus = z.infer<typeof ReferralStatus>;

// Base Referral schema
export const referralSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  context: z.string().min(1).max(500),
  status: ReferralStatus,
  createdAt: z.date(),
});

// Schema for creating a referral
export const referralCreateSchema = referralSchema.omit({ 
  id: true, 
  createdAt: true,
  status: true
}).extend({
  status: z.literal('draft').optional().default('draft'),
});

// Schema for updating a referral
export const referralUpdateSchema = z.object({
  status: ReferralStatus,
});

// Schema for referral response
export const referralResponseSchema = referralSchema;

// TypeScript types derived from Zod schemas
export type Referral = z.infer<typeof referralSchema>;
export type ReferralCreate = z.infer<typeof referralCreateSchema>;
export type ReferralUpdate = z.infer<typeof referralUpdateSchema>;
export type ReferralResponse = z.infer<typeof referralResponseSchema>;
