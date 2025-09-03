/**
 * Availability schema definitions
 * Contains Zod schemas and TypeScript types for Availability entity
 */
import { z } from 'zod';
export declare const availabilitySchema: z.ZodObject<{
    userId: z.ZodString;
    weekMask: z.ZodArray<z.ZodBoolean, "many">;
}, "strip", z.ZodTypeAny, {
    userId?: string;
    weekMask?: boolean[];
}, {
    userId?: string;
    weekMask?: boolean[];
}>;
export declare const availabilityUpdateSchema: z.ZodObject<{
    weekMask: z.ZodArray<z.ZodBoolean, "many">;
}, "strip", z.ZodTypeAny, {
    weekMask?: boolean[];
}, {
    weekMask?: boolean[];
}>;
export declare const availabilityResponseSchema: z.ZodObject<{
    userId: z.ZodString;
    weekMask: z.ZodArray<z.ZodBoolean, "many">;
}, "strip", z.ZodTypeAny, {
    userId?: string;
    weekMask?: boolean[];
}, {
    userId?: string;
    weekMask?: boolean[];
}>;
export type Availability = z.infer<typeof availabilitySchema>;
export type AvailabilityUpdate = z.infer<typeof availabilityUpdateSchema>;
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;
//# sourceMappingURL=availability.d.ts.map