/**
 * Connection schema definitions
 * Contains Zod schemas and TypeScript types for Connection entity
 */
import { z } from 'zod';
export declare const ConnectionStatus: z.ZodEnum<["pending", "accepted", "blocked"]>;
export type ConnectionStatus = z.infer<typeof ConnectionStatus>;
export declare const connectionSchema: z.ZodObject<{
    id: z.ZodString;
    requesterId: z.ZodString;
    addresseeId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "blocked"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "accepted" | "blocked";
    id?: string;
    createdAt?: Date;
    requesterId?: string;
    addresseeId?: string;
}, {
    status?: "pending" | "accepted" | "blocked";
    id?: string;
    createdAt?: Date;
    requesterId?: string;
    addresseeId?: string;
}>;
export declare const connectionCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    requesterId: z.ZodString;
    addresseeId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "blocked"]>;
    createdAt: z.ZodDate;
}, "status" | "id" | "createdAt"> & {
    status: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"pending">>>;
}, "strip", z.ZodTypeAny, {
    status?: "pending";
    requesterId?: string;
    addresseeId?: string;
}, {
    status?: "pending";
    requesterId?: string;
    addresseeId?: string;
}>;
export declare const connectionUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "accepted", "blocked"]>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "accepted" | "blocked";
}, {
    status?: "pending" | "accepted" | "blocked";
}>;
export declare const connectionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    requesterId: z.ZodString;
    addresseeId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "blocked"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "accepted" | "blocked";
    id?: string;
    createdAt?: Date;
    requesterId?: string;
    addresseeId?: string;
}, {
    status?: "pending" | "accepted" | "blocked";
    id?: string;
    createdAt?: Date;
    requesterId?: string;
    addresseeId?: string;
}>;
export type Connection = z.infer<typeof connectionSchema>;
export type ConnectionCreate = z.infer<typeof connectionCreateSchema>;
export type ConnectionUpdate = z.infer<typeof connectionUpdateSchema>;
export type ConnectionResponse = z.infer<typeof connectionResponseSchema>;
//# sourceMappingURL=connection.d.ts.map