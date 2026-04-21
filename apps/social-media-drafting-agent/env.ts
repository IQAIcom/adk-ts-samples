import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema.
 *
 * GOOGLE_API_KEY is required (it powers the LLM).

 */
export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
});

export const env = envSchema.parse(process.env);
