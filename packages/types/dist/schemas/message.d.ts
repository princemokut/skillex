/**
 * Message schema definitions
 * Contains Zod schemas and TypeScript types for Message entity
 */
import { z } from 'zod';
export declare const messageSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    userId: z.ZodString;
    body: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    cohortId: string;
    body: string;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    cohortId: string;
    body: string;
}>;
export declare const messageCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    cohortId: z.ZodString;
    userId: z.ZodString;
    body: z.ZodString;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    userId: string;
    cohortId: string;
    body: string;
}, {
    userId: string;
    cohortId: string;
    body: string;
}>;
export declare const messageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    userId: z.ZodString;
    body: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    cohortId: string;
    body: string;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    cohortId: string;
    body: string;
}>;
export declare const paginatedMessagesSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        cohortId: z.ZodString;
        userId: z.ZodString;
        body: z.ZodString;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: Date;
        userId: string;
        cohortId: string;
        body: string;
    }, {
        id: string;
        createdAt: Date;
        userId: string;
        cohortId: string;
        body: string;
    }>, "many">;
    cursor: z.ZodOptional<z.ZodString>;
    hasMore: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    messages: {
        id: string;
        createdAt: Date;
        userId: string;
        cohortId: string;
        body: string;
    }[];
    hasMore: boolean;
    cursor?: string | undefined;
}, {
    messages: {
        id: string;
        createdAt: Date;
        userId: string;
        cohortId: string;
        body: string;
    }[];
    hasMore: boolean;
    cursor?: string | undefined;
}>;
export type Message = z.infer<typeof messageSchema>;
export type MessageCreate = z.infer<typeof messageCreateSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type PaginatedMessages = z.infer<typeof paginatedMessagesSchema>;
//# sourceMappingURL=message.d.ts.map