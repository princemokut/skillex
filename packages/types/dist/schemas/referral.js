"use strict";
/**
 * Referral schema definitions
 * Contains Zod schemas and TypeScript types for Referral entity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralResponseSchema = exports.referralUpdateSchema = exports.referralCreateSchema = exports.referralSchema = exports.ReferralStatus = void 0;
const zod_1 = require("zod");
// Referral status enum
exports.ReferralStatus = zod_1.z.enum(['draft', 'sent', 'accepted', 'declined']);
// Base Referral schema
exports.referralSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    fromUserId: zod_1.z.string().uuid(),
    toUserId: zod_1.z.string().uuid(),
    context: zod_1.z.string().min(1).max(500),
    status: exports.ReferralStatus,
    createdAt: zod_1.z.date(),
});
// Schema for creating a referral
exports.referralCreateSchema = exports.referralSchema.omit({
    id: true,
    createdAt: true,
    status: true
}).extend({
    status: zod_1.z.literal('draft').optional().default('draft'),
});
// Schema for updating a referral
exports.referralUpdateSchema = zod_1.z.object({
    status: exports.ReferralStatus,
});
// Schema for referral response
exports.referralResponseSchema = exports.referralSchema;
