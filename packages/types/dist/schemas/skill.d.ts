/**
 * Skill schema definitions
 * Contains Zod schemas and TypeScript types for Skill entity
 */
import { z } from 'zod';
export declare const SkillKind: z.ZodEnum<["teach", "learn"]>;
export type SkillKind = z.infer<typeof SkillKind>;
export declare const SkillLevel: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
export type SkillLevel = z.infer<typeof SkillLevel>;
export declare const skillSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["teach", "learn"]>;
    tags: z.ZodArray<z.ZodString, "many">;
    level: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}, {
    id?: string;
    createdAt?: Date;
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}>;
export declare const skillCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["teach", "learn"]>;
    tags: z.ZodArray<z.ZodString, "many">;
    level: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}, {
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}>;
export declare const skillUpdateSchema: z.ZodObject<{
    kind: z.ZodOptional<z.ZodEnum<["teach", "learn"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    level: z.ZodOptional<z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}, {
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}>;
export declare const skillResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kind: z.ZodEnum<["teach", "learn"]>;
    tags: z.ZodArray<z.ZodString, "many">;
    level: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}, {
    id?: string;
    createdAt?: Date;
    userId?: string;
    kind?: "teach" | "learn";
    tags?: string[];
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    notes?: string;
}>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCreate = z.infer<typeof skillCreateSchema>;
export type SkillUpdate = z.infer<typeof skillUpdateSchema>;
export type SkillResponse = z.infer<typeof skillResponseSchema>;
//# sourceMappingURL=skill.d.ts.map