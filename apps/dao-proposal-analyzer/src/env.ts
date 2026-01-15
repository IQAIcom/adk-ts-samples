import { config } from "dotenv";
import { z } from "zod";

config();
export const envSchema = z.object({
	ADK_DEBUG: z.coerce.boolean().default(false),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gpt-4o-mini"),
	ETHEREUM_RPC_URL: z.string().default("https://eth.llamarpc.com"),
	ETHERSCAN_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
