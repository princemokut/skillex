/**
 * User schema definitions
 * Contains Zod schemas and TypeScript types for User entity
 */
import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    handle: z.ZodString;
    fullName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    timezone: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
    locationCity: z.ZodOptional<z.ZodString>;
    locationCountry: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    createdAt: Date;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}, {
    id: string;
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    createdAt: Date;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}>;
export declare const userCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    handle: z.ZodString;
    fullName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    timezone: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
    locationCity: z.ZodOptional<z.ZodString>;
    locationCountry: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}, {
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodString>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    locationCity: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    locationCountry: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    fullName?: string | undefined;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    timezone?: string | undefined;
    languages?: string[] | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}, {
    fullName?: string | undefined;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    timezone?: string | undefined;
    languages?: string[] | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}>;
export declare const userResponseSchema: z.ZodObject<{
    id: z.ZodString;
    handle: z.ZodString;
    fullName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    timezone: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
    locationCity: z.ZodOptional<z.ZodString>;
    locationCountry: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    createdAt: Date;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}, {
    id: string;
    handle: string;
    fullName: string;
    timezone: string;
    languages: string[];
    createdAt: Date;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
    locationCity?: string | undefined;
    locationCountry?: string | undefined;
}>;
export type User = z.infer<typeof userSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
//# sourceMappingURL=user.d.ts.map