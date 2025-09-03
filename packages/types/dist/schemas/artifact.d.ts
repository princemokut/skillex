/**
 * Artifact schema definitions
 * Contains Zod schemas and TypeScript types for Artifact entity
 */
import { z } from 'zod';
export declare const ArtifactKind: z.ZodEnum<["repo", "doc", "video", "image", "other"]>;
export type ArtifactKind = z.infer<typeof ArtifactKind>;
export declare const artifactSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    url: z.ZodString;
    kind: z.ZodEnum<["repo", "doc", "video", "image", "other"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    url?: string;
    id?: string;
    createdAt?: Date;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}, {
    url?: string;
    id?: string;
    createdAt?: Date;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}>;
export declare const artifactCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    cohortId: z.ZodString;
    url: z.ZodString;
    kind: z.ZodEnum<["repo", "doc", "video", "image", "other"]>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    url?: string;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}, {
    url?: string;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}>;
export declare const artifactResponseSchema: z.ZodObject<{
    id: z.ZodString;
    cohortId: z.ZodString;
    url: z.ZodString;
    kind: z.ZodEnum<["repo", "doc", "video", "image", "other"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    url?: string;
    id?: string;
    createdAt?: Date;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}, {
    url?: string;
    id?: string;
    createdAt?: Date;
    kind?: "repo" | "doc" | "video" | "image" | "other";
    cohortId?: string;
}>;
export type Artifact = z.infer<typeof artifactSchema>;
export type ArtifactCreate = z.infer<typeof artifactCreateSchema>;
export type ArtifactResponse = z.infer<typeof artifactResponseSchema>;
//# sourceMappingURL=artifact.d.ts.map