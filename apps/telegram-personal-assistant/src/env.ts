/**
 * Environment Configuration
 *
 * Validates and provides type-safe access to environment variables using Zod.
 * All environment variables are validated at startup, ensuring the application
 * has all required configuration before running.
 */

import { config } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
config();

/**
 * Environment variable schema definition
 * Validates all required and optional configuration at startup
 */
export const envSchema = z.object({
	// Debug mode for development
	ADK_DEBUG: z.string().default("false"),

	// Google AI API key for Gemini language model
	GOOGLE_API_KEY: z.string(),

	// PostgreSQL database connection string for state persistence
	DATABASE_URL: z.string(),

	// Telegram bot token from @BotFather (optional for testing)
	TELEGRAM_BOT_TOKEN: z.string().optional(),

	// Telegram channel/chat ID for sending notifications
	TELEGRAM_CHANNEL_ID: z.string(),

	// LLM model to use across all agents
	LLM_MODEL: z
		.string()
		.default("gemini-2.5-flash")
		.describe("LLM Model common to use by all the agents"),

	// How often to check for due reminders (in milliseconds)
	REMINDER_POLLING_MS: z
		.coerce.number()
		.default(30_000)
		.describe("Polling interval for checking reminders in MS"),

/**
 * Validated and type-safe environment variables
 * Throws an error if validation fails
 */
export const env = envSchema.parse(process.env);
