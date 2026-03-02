import * as dotenv from "dotenv";
import { InMemoryMemoryService } from "@iqai/adk";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * Research Assistant - Sequential Agent Pipeline Demo
 *
 * Demonstrates ADK-TS framework features through a 4-step sequential pipeline:
 *
 * Framework features showcased:
 *   - SequentialAgent: Enforces strict pipeline execution order
 *   - Session State: Pre-initialized with `app:` prefixed config values
 *   - Before/After Callbacks: Logs pipeline progress with timing on each step
 *   - Memory Service: Stores completed research for cross-session recall
 *   - State-driven data flow: Each agent reads/writes to shared session state
 *
 * Pipeline steps:
 *   1. Researcher  → Web search via Tavily API  → search_results
 *   2. Analyst     → Extracts insights           → analysis_report
 *   3. Recommender → Produces recommendations    → recommendations
 *   4. Writer      → Synthesizes final report    → final_report
 */

async function main() {
	const { runner, session } = await getRootAgent();

	// Create a memory service instance for storing/recalling research sessions.
	// In a real app, this would be injected or shared across the application.
	const memoryService = new InMemoryMemoryService();

	console.log("==============================");
	console.log("  Research Assistant Pipeline");
	console.log("==============================\n");

	// Show pre-initialized session state (app-level config)
	console.log("Session state (app-level config):");
	console.log(`  app:max_searches   = ${session.state["app:max_searches"]}`);
	console.log(
		`  app:pipeline_steps = ${JSON.stringify(session.state["app:pipeline_steps"])}`,
	);
	console.log();

	const topic = "Impact of artificial intelligence on healthcare in 2025";

	console.log(`Research topic: "${topic}"\n`);
	console.log("Starting sequential pipeline...");
	console.log("(Before/after callbacks will log each step)\n");

	try {
		// Run the full pipeline — callbacks log progress automatically
		const result = await runner.ask(topic);
		console.log("\n" + "=".repeat(50));
		console.log("  Final Report");
		console.log("=".repeat(50) + "\n");
		console.log(result);

		// Save completed research session to memory for future recall
		await memoryService.addSessionToMemory(session);

		console.log("\n" + "=".repeat(50));
		console.log("  Memory Service Demo");
		console.log("=".repeat(50) + "\n");
		console.log("Research session saved to memory.\n");

		// Demonstrate searching past research from memory
		const memories = await memoryService.searchMemory({
			appName: "research_assistant",
			userId: "user",
			query: topic,
		});
		console.log(
			`Search for "${topic}" found ${memories.memories.length} stored session(s).`,
		);
	} catch (error) {
		console.error("Error running research pipeline:", error);
	}
}

main().catch(console.error);
