/**
 * Environment variable configuration module
 * Validates and parses environment variables with Zod
 */
export declare const env: {
    DATABASE_URL: string;
    SUPABASE_JWKS_URL: string;
    ALLOWED_ORIGINS: string[];
    APP_ENV: "development" | "production";
    PORT: number;
    HOST: string;
    RESEND_API_KEY?: string | undefined;
};
