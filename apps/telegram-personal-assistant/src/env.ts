import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	ADK_DEBUG: z.string().default("false"),
	GOOGLE_API_KEY: z.string(),
	DATABASE_URL: z.string(),
	TELEGRAM_BOT_TOKEN: z.string().optional(),
	TELEGRAM_CHANNEL_ID: z.string(),
	LLM_MODEL: z
		.string()
		.default("gemini-2.5-flash")
		.describe("LLM Model common to use by all the agents"),
	REMINDER_POLLING_MS: z
		.number()
		.default(30_000)
		.describe("Polling interval for checking reminders in MS"),
});

export const env = envSchema.parse(process.env);
