/**
 * Telegram Tools Configuration
 *
 * Configures and provides Telegram bot tools using the MCP (Model Context Protocol)
 * Telegram integration from @iqai/adk.
 *
 * The McpTelegram toolset provides:
 * - Message sending and receiving capabilities
 * - Bot configuration and authentication
 * - Channel/chat communication
 * - Real-time notification delivery
 */

import { McpTelegram, type SamplingHandler } from "@iqai/adk";
import { env } from "@/env";

/**
 * Initializes and returns Telegram bot tools
 *
 * @param samplingHandler - Handler for LLM interactions and tool execution context
 * @returns Array of Telegram tools ready to be attached to an agent
 */
export const getTelegramTools = async (samplingHandler: SamplingHandler) => {
	// Initialize the MCP Telegram toolset with bot authentication
	const toolset = McpTelegram({
		samplingHandler, // Provides context for tool execution
		env: {
			TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN, // Bot token from @BotFather
		},
	});

	// Retrieve all available Telegram tools from the toolset
	const tools = await toolset.getTools();

	return tools;
};
