"use strict";
/**
 * Availability schema definitions
 * Contains Zod schemas and TypeScript types for Availability entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityResponseSchema = exports.availabilityUpdateSchema = exports.availabilitySchema = void 0;
const zod_1 = require("zod");
// Base Availability schema
exports.availabilitySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    // weekMask is an array of 168 booleans (24 hours * 7 days)
    // Each value represents a 1-hour slot in the week, starting from Monday 00:00
    weekMask: zod_1.z.array(zod_1.z.boolean()).length(168),
});
// Schema for updating availability
exports.availabilityUpdateSchema = zod_1.z.object({
    weekMask: zod_1.z.array(zod_1.z.boolean()).length(168),
});
// Schema for availability response
exports.availabilityResponseSchema = exports.availabilitySchema;
