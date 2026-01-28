import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema for the DeBank Portfolio Analyzer agent.
 *
 * Defines and validates environment variables:
 * - ADK_DEBUG: Optional debug mode flag (defaults to false)
 * - GOOGLE_API_KEY: Required API key for Google/Gemini LLM access
 * - LLM_MODEL: Optional model identifier (defaults to "gemini-2.5-flash")
 * - DEBANK_API_KEY: Required API key for DeBank Cloud / debank-mcp
 */
export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	DEBANK_API_KEY: z.string()
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
