import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * Research Assistant - Sequential Agent Pipeline Demo
 *
 * Demonstrates a 4-step sequential agent pipeline using ADK-TS:
 *   1. Researcher  → Web search via Tavily API
 *   2. Analyst     → Extracts insights and patterns
 *   3. Recommender → Produces actionable recommendations
 *   4. Writer      → Synthesizes a final comprehensive report
 *
 * Each agent reads from state populated by prior agents, showcasing
 * how SequentialAgent enables clean data pipelines.
 */

async function main() {
	const { runner } = await getRootAgent();

	console.log("==============================");
	console.log("  Research Assistant Pipeline");
	console.log("==============================\n");

	const topic = "Impact of artificial intelligence on healthcare in 2025";

	console.log(`Research topic: "${topic}"\n`);
	console.log("Starting sequential pipeline...\n");
	console.log("  Step 1: Researcher  - Gathering web data");
	console.log("  Step 2: Analyst     - Extracting insights");
	console.log("  Step 3: Recommender - Producing recommendations");
	console.log("  Step 4: Writer      - Synthesizing final report");
	console.log("\n" + "=".repeat(50) + "\n");

	try {
		const result = await runner.ask(topic);
		console.log(result);
	} catch (error) {
		console.error("Error running research pipeline:", error);
	}
}

main().catch(console.error);
