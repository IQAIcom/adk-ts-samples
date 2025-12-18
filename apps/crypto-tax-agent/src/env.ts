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

if (!env.GOOGLE_API_KEY) {
	throw new Error("At least one LLM API key must be provided: GOOGLE_API_KEY");
}
