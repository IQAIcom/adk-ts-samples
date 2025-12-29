import { createSamplingHandler } from "@iqai/adk";
import { config } from "dotenv";
import { createTaskMasterAgent } from "./agents/task-master-agent/agent";
import { createTelegramAgent } from "./agents/telegram-agent/agent";
import { ReminderNotificationService } from "./services/reminder-notification";

// load env vars
config();

/**
 * TaskMaster Bot - Your Intelligent Personal Productivity Assistant
 *
 * An AI-powered Telegram bot built with the @iqai/adk library that helps you master your
 * daily tasks through intelligent reminder management and shopping list assistance.
 *
 * Features:
 * - 🔔 Smart reminder management with flexible time parsing and recurring reminders
 * - 🛒 Shopping list assistant with item tracking and completion management
 * - 🤖 Multi-agent architecture with specialized sub-agents for different tasks
 * - 📱 Real-time Telegram notifications for due reminders
 * - 💾 Persistent state management with PostgreSQL database
 * - 🧠 Natural language understanding powered by Google Gemini
 *
 * The bot uses a hierarchical agent system where the main TaskMaster agent routes
 * user requests to specialized sub-agents (reminder-agent, shopping-list-agent),
 * while a background notification service monitors for due reminders and sends
 * automatic Telegram notifications.
 *
 * @see README.md for detailed setup instructions and usage examples
 */

async function main() {
	console.log("🤖 Initializing Telegram bot agent...");

	// Initialize agents
	const { sessionService, session, runner } = await createTaskMasterAgent();
	const { runner: telegramRunner } = await createTelegramAgent(
		createSamplingHandler(runner.ask),
	);

	console.log("✅ Telegram bot agent initialized successfully!");
	console.log("🚀 Bot is now running and ready to receive messages...");

	// Start the reminder notification service
	const reminderService = new ReminderNotificationService(
		session,
		sessionService,
		telegramRunner,
	);
	reminderService.start();

	// Handle graceful shutdown
	process.on("SIGINT", () => {
		console.log("\n👋 Shutting down Telegram bot gracefully...");
		reminderService.stop();
		process.exit(0);
	});

	// Keep the process alive
	setInterval(() => {
		// Just keep the process running
	}, 1000);
}

main().catch(console.error);
