/**
 * Feedback schema definitions
 * Contains Zod schemas and TypeScript types for Feedback entity
 */
import { z } from 'zod';
export declare const feedbackSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    rating: z.ZodNumber;
    text: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}>;
export declare const feedbackCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    cohortId: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    rating: z.ZodNumber;
    text: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}, {
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}>;
export declare const feedbackResponseSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    rating: z.ZodNumber;
    text: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    cohortId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    text?: string | undefined;
}>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type FeedbackCreate = z.infer<typeof feedbackCreateSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
//# sourceMappingURL=feedback.d.ts.map