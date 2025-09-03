/**
 * Notification schema definitions
 * Contains Zod schemas and TypeScript types for Notification entity
 */

import { z } from 'zod';

// Notification kind enum
export const NotificationKind = z.enum([
  'connection_request',
  'connection_accepted',
  'cohort_invitation',
  'session_reminder',
  'new_message',
  'feedback_received',
  'endorsement_received',
  'referral_received',
  'referral_accepted',
  'system',
]);
export type NotificationKind = z.infer<typeof NotificationKind>;

// Base Notification schema
export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  kind: NotificationKind,
  payload: z.record(z.unknown()),
  readAt: z.date().optional(),
  createdAt: z.date(),
});

// Schema for creating a notification
export const notificationCreateSchema = notificationSchema.omit({ 
  id: true, 
  readAt: true,
  createdAt: true 
});

// Schema for updating a notification
export const notificationUpdateSchema = z.object({
  readAt: z.date().optional(),
});

// Schema for notification response
export const notificationResponseSchema = notificationSchema;

// TypeScript types derived from Zod schemas
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationCreate = z.infer<typeof notificationCreateSchema>;
export type NotificationUpdate = z.infer<typeof notificationUpdateSchema>;
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
