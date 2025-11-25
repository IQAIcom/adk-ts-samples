/**
 * Telegram Agent
 *
 * This agent handles Telegram bot integration and message routing.
 * It serves as the communication interface between users and the TaskMaster system.
 *
 * Key responsibilities:
 * - Receive and process incoming Telegram messages
 * - Route user requests to the appropriate agents
 * - Send responses back to users via Telegram
 * - Manage Telegram bot configuration and authentication
 */

import { AgentBuilder, type SamplingHandler } from "@iqai/adk";
import { env } from "@/env";
import { getTelegramTools } from "./tools";

/**
 * Creates and configures the Telegram agent
 *
 * @param samplingHandler - Handler for LLM interactions and tool execution
 * @returns Configured agent instance ready to handle Telegram communications
 */
export const createTelegramAgent = async (samplingHandler: SamplingHandler) => {
	// Initialize Telegram-specific tools (message handling, bot integration)
	const tools = await getTelegramTools(samplingHandler);

	// Build the agent with LLM model and Telegram tools
	return AgentBuilder.create("telegram_agent")
		.withModel(env.LLM_MODEL) // Use configured language model
		.withTools(...tools) // Attach Telegram bot tools
		.build();
};
