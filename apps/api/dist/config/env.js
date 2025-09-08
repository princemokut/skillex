"use strict";
/**
 * Environment variable configuration module
 * Validates and parses environment variables with Zod
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load environment variables from .env file in the root directory
dotenv.config({ path: path.join(__dirname, '../../../../.env') });
// Define schema for environment variables
const envSchema = zod_1.z.object({
    // Database
    DATABASE_URL: zod_1.z.string().min(1),
    // Auth
    SUPABASE_JWKS_URL: zod_1.z.string().url(),
    // CORS
    ALLOWED_ORIGINS: zod_1.z.string().min(1)
        .transform(val => val.split(',').map(origin => origin.trim())),
    // App environment
    APP_ENV: zod_1.z.enum(['development', 'production']).default('development'),
    // Server
    PORT: zod_1.z.coerce.number().positive().default(3001),
    HOST: zod_1.z.string().default('0.0.0.0'),
    // Email (optional)
    RESEND_API_KEY: zod_1.z.string().optional(),
});
/**
 * Try to parse environment variables
 * Exit process if validation fails
 */
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error('❌ Invalid environment variables:', error);
        process.exit(1);
    }
}
// Export validated environment variables
exports.env = validateEnv();
