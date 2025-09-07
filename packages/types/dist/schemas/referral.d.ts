/**
 * Referral schema definitions
 * Contains Zod schemas and TypeScript types for Referral entity
 */
import { z } from 'zod';
export declare const ReferralStatus: z.ZodEnum<["draft", "sent", "accepted", "declined"]>;
export type ReferralStatus = z.infer<typeof ReferralStatus>;
export declare const referralSchema: z.ZodObject<{
    id: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    context: z.ZodString;
    status: z.ZodEnum<["draft", "sent", "accepted", "declined"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "accepted" | "draft" | "sent" | "declined";
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    context: string;
}, {
    id: string;
    status: "accepted" | "draft" | "sent" | "declined";
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    context: string;
}>;
export declare const referralCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    context: z.ZodString;
    status: z.ZodEnum<["draft", "sent", "accepted", "declined"]>;
    createdAt: z.ZodDate;
}, "id" | "status" | "createdAt"> & {
    status: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"draft">>>;
}, "strip", z.ZodTypeAny, {
    status: "draft";
    fromUserId: string;
    toUserId: string;
    context: string;
}, {
    fromUserId: string;
    toUserId: string;
    context: string;
    status?: "draft" | undefined;
}>;
export declare const referralUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["draft", "sent", "accepted", "declined"]>;
}, "strip", z.ZodTypeAny, {
    status: "accepted" | "draft" | "sent" | "declined";
}, {
    status: "accepted" | "draft" | "sent" | "declined";
}>;
export declare const referralResponseSchema: z.ZodObject<{
    id: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    context: z.ZodString;
    status: z.ZodEnum<["draft", "sent", "accepted", "declined"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "accepted" | "draft" | "sent" | "declined";
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    context: string;
}, {
    id: string;
    status: "accepted" | "draft" | "sent" | "declined";
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    context: string;
}>;
export type Referral = z.infer<typeof referralSchema>;
export type ReferralCreate = z.infer<typeof referralCreateSchema>;
export type ReferralUpdate = z.infer<typeof referralUpdateSchema>;
export type ReferralResponse = z.infer<typeof referralResponseSchema>;
//# sourceMappingURL=referral.d.ts.map