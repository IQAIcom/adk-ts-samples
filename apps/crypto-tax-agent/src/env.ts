import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	GOOGLE_API_KEY: z.string().optional(),
	ETHERSCAN_API_KEY: z.string().optional(),
	COINGECKO_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);

if (env.LLM_MODEL.startsWith("gemini") && !env.GOOGLE_API_KEY) {
	throw new Error(
		"GOOGLE_API_KEY must be provided when using a Gemini model. If using another provider, ensure its API key is set and the LLM_MODEL environment variable is updated.",
	);
}
