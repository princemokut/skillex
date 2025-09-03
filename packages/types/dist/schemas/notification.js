"use strict";
/**
 * Notification schema definitions
 * Contains Zod schemas and TypeScript types for Notification entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationResponseSchema = exports.notificationUpdateSchema = exports.notificationCreateSchema = exports.notificationSchema = exports.NotificationKind = void 0;
const zod_1 = require("zod");
// Notification kind enum
exports.NotificationKind = zod_1.z.enum([
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
// Base Notification schema
exports.notificationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    kind: exports.NotificationKind,
    payload: zod_1.z.record(zod_1.z.unknown()),
    readAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
});
// Schema for creating a notification
exports.notificationCreateSchema = exports.notificationSchema.omit({
    id: true,
    readAt: true,
    createdAt: true
});
// Schema for updating a notification
exports.notificationUpdateSchema = zod_1.z.object({
    readAt: zod_1.z.date().optional(),
});
// Schema for notification response
exports.notificationResponseSchema = exports.notificationSchema;
