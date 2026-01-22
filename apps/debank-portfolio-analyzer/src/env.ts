import { config } from "dotenv";
import { z } from "zod";
// import { type LanguageModelV2, createOpenRouter } from "@openrouter/ai-sdk-provider";

config();

/**
 * Environment variable schema definition for the simple agent.
 *
 * Defines and validates required environment variables including:
 * - DEBUG: Optional debug mode flag (defaults to "false")
 * - GOOGLE_API_KEY: Required API key for Google/Gemini model access
 */
export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	OPENROUTER_API_KEY: z.string(),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	DEBANK_API_KEY: z.string()
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
// export let model: LanguageModelV2;
// console.log("🚀 AGENT WILL USE OPENROUTER 🚀");
// console.log(`LLM_MODEL: ${env.LLM_MODEL}`);
// console.log(`OPEN_ROUTER_KEY: ${env.OPENROUTER_API_KEY ? "Set" : "Not Set"}`); // Log if key is set, not the key itself
// const openrouter = createOpenRouter({
// 	apiKey: env.OPENROUTER_API_KEY,
// });
// model = openrouter(env.LLM_MODEL);
