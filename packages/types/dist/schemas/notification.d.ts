/**
 * Notification schema definitions
 * Contains Zod schemas and TypeScript types for Notification entity
 */
import { z } from 'zod';
export declare const NotificationKind: z.ZodEnum<["connection_request", "connection_accepted", "cohort_invitation", "session_reminder", "new_message", "feedback_received", "endorsement_received", "referral_received", "referral_accepted", "system"]>;
export type NotificationKind = z.infer<typeof NotificationKind>;
export declare const notificationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["connection_request", "connection_accepted", "cohort_invitation", "session_reminder", "new_message", "feedback_received", "endorsement_received", "referral_received", "referral_accepted", "system"]>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    readAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
    readAt?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
    readAt?: Date | undefined;
}>;
export declare const notificationCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["connection_request", "connection_accepted", "cohort_invitation", "session_reminder", "new_message", "feedback_received", "endorsement_received", "referral_received", "referral_accepted", "system"]>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    readAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "id" | "createdAt" | "readAt">, "strip", z.ZodTypeAny, {
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
}, {
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
}>;
export declare const notificationUpdateSchema: z.ZodObject<{
    readAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    readAt?: Date | undefined;
}, {
    readAt?: Date | undefined;
}>;
export declare const notificationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["connection_request", "connection_accepted", "cohort_invitation", "session_reminder", "new_message", "feedback_received", "endorsement_received", "referral_received", "referral_accepted", "system"]>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    readAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
    readAt?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    kind: "connection_request" | "connection_accepted" | "cohort_invitation" | "session_reminder" | "new_message" | "feedback_received" | "endorsement_received" | "referral_received" | "referral_accepted" | "system";
    payload: Record<string, unknown>;
    readAt?: Date | undefined;
}>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationCreate = z.infer<typeof notificationCreateSchema>;
export type NotificationUpdate = z.infer<typeof notificationUpdateSchema>;
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
//# sourceMappingURL=notification.d.ts.map