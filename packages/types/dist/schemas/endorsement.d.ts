/**
 * Endorsement schema definitions
 * Contains Zod schemas and TypeScript types for Endorsement entity
 */
import { z } from 'zod';
export declare const endorsementSchema: z.ZodObject<{
    id: z.ZodString;
    endorserId: z.ZodString;
    endorseeId: z.ZodString;
    tag: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}, {
    id?: string;
    createdAt?: Date;
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}>;
export declare const endorsementCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    endorserId: z.ZodString;
    endorseeId: z.ZodString;
    tag: z.ZodString;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}, {
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}>;
export declare const endorsementResponseSchema: z.ZodObject<{
    id: z.ZodString;
    endorserId: z.ZodString;
    endorseeId: z.ZodString;
    tag: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}, {
    id?: string;
    createdAt?: Date;
    endorserId?: string;
    endorseeId?: string;
    tag?: string;
}>;
export type Endorsement = z.infer<typeof endorsementSchema>;
export type EndorsementCreate = z.infer<typeof endorsementCreateSchema>;
export type EndorsementResponse = z.infer<typeof endorsementResponseSchema>;
//# sourceMappingURL=endorsement.d.ts.map