/**
 * Session schema definitions
 * Contains Zod schemas and TypeScript types for Session entity
 */
import { z } from 'zod';
export declare const sessionSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    weekIndex: z.ZodNumber;
    startsAt: z.ZodDate;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
    notesUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}, {
    id?: string;
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}>;
export declare const sessionCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    cohortId: z.ZodString;
    weekIndex: z.ZodNumber;
    startsAt: z.ZodDate;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
    notesUrl: z.ZodOptional<z.ZodString>;
}, "id">, "strip", z.ZodTypeAny, {
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}, {
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}>;
export declare const sessionUpdateSchema: z.ZodObject<{
    weekIndex: z.ZodOptional<z.ZodNumber>;
    startsAt: z.ZodOptional<z.ZodDate>;
    durationMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    notesUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}, {
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}>;
export declare const sessionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    weekIndex: z.ZodNumber;
    startsAt: z.ZodDate;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
    notesUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}, {
    id?: string;
    cohortId?: string;
    weekIndex?: number;
    startsAt?: Date;
    durationMinutes?: number;
    notesUrl?: string;
}>;
export type Session = z.infer<typeof sessionSchema>;
export type SessionCreate = z.infer<typeof sessionCreateSchema>;
export type SessionUpdate = z.infer<typeof sessionUpdateSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
//# sourceMappingURL=session.d.ts.map