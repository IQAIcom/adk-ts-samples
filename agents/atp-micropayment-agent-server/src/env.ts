import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variables schema for the ATP Micropayment Server
 * Validates and provides type-safe access to server configuration
 */
const envSchema = z.object({
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
