/**
 * Cohort schema definitions
 * Contains Zod schemas and TypeScript types for Cohort entity
 */
import { z } from 'zod';
export declare const CohortVisibility: z.ZodEnum<["private", "public"]>;
export type CohortVisibility = z.infer<typeof CohortVisibility>;
export declare const cohortSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    ownerId: z.ZodString;
    size: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodDate;
    weeks: z.ZodDefault<z.ZodNumber>;
    visibility: z.ZodDefault<z.ZodEnum<["private", "public"]>>;
    city: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    size?: number;
    id?: string;
    createdAt?: Date;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}, {
    size?: number;
    id?: string;
    createdAt?: Date;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}>;
export declare const cohortCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    ownerId: z.ZodString;
    size: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodDate;
    weeks: z.ZodDefault<z.ZodNumber>;
    visibility: z.ZodDefault<z.ZodEnum<["private", "public"]>>;
    city: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    size?: number;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}, {
    size?: number;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}>;
export declare const cohortUpdateSchema: z.ZodObject<{
    size: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    weeks: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    visibility: z.ZodOptional<z.ZodDefault<z.ZodEnum<["private", "public"]>>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    size?: number;
    title?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}, {
    size?: number;
    title?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}>;
export declare const cohortResponseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    ownerId: z.ZodString;
    size: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodDate;
    weeks: z.ZodDefault<z.ZodNumber>;
    visibility: z.ZodDefault<z.ZodEnum<["private", "public"]>>;
    city: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    size?: number;
    id?: string;
    createdAt?: Date;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}, {
    size?: number;
    id?: string;
    createdAt?: Date;
    title?: string;
    ownerId?: string;
    startDate?: Date;
    weeks?: number;
    visibility?: "private" | "public";
    city?: string;
}>;
export declare const MemberRole: z.ZodEnum<["teacher", "learner", "facilitator"]>;
export type MemberRole = z.infer<typeof MemberRole>;
export declare const cohortMemberSchema: z.ZodObject<{
    cohortId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["teacher", "learner", "facilitator"]>;
    joinedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    userId?: string;
    cohortId?: string;
    role?: "teacher" | "learner" | "facilitator";
    joinedAt?: Date;
}, {
    userId?: string;
    cohortId?: string;
    role?: "teacher" | "learner" | "facilitator";
    joinedAt?: Date;
}>;
export declare const cohortMemberCreateSchema: z.ZodObject<Omit<{
    cohortId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["teacher", "learner", "facilitator"]>;
    joinedAt: z.ZodDate;
}, "joinedAt">, "strip", z.ZodTypeAny, {
    userId?: string;
    cohortId?: string;
    role?: "teacher" | "learner" | "facilitator";
}, {
    userId?: string;
    cohortId?: string;
    role?: "teacher" | "learner" | "facilitator";
}>;
export type Cohort = z.infer<typeof cohortSchema>;
export type CohortCreate = z.infer<typeof cohortCreateSchema>;
export type CohortUpdate = z.infer<typeof cohortUpdateSchema>;
export type CohortResponse = z.infer<typeof cohortResponseSchema>;
export type CohortMember = z.infer<typeof cohortMemberSchema>;
export type CohortMemberCreate = z.infer<typeof cohortMemberCreateSchema>;
//# sourceMappingURL=cohort.d.ts.map