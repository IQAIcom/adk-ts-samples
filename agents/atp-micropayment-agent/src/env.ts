import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema definition for the ATP Micropayment Agent.
 * Validates both agent and server configuration.
 */
export const envSchema = z.object({
	// Agent configuration
	ADK_DEBUG: z.coerce.boolean().default(false),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	WALLET_PRIVATE_KEY: z.string(),
	API_SERVER_URL: z.string().url().default("http://localhost:3001"),

	// Server configuration
	FACILITATOR_URL: z
		.string()
		.url("FACILITATOR_URL must be a valid URL")
		.default("https://x402.org/facilitator"),
	ADDRESS: z
		.string()
		.regex(
			/^0x[a-fA-F0-9]{40}$/,
			"ADDRESS must be a valid Ethereum address (0x...)",
		)
		.min(1, "ADDRESS is required"),
	NETWORK: z
		.enum([
			"base-sepolia",
			"base",
			"avalanche-fuji",
			"avalanche",
			"iotex",
		] as const)
		.default("base-sepolia"),
	IQ_API_BASE_URL: z.string().url().default("https://app.iqai.com/api"),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
