import * as readline from "node:readline";
import "dotenv/config";
import { getRootAgent } from "./agents/agent";

async function main() {
	const { runner } = await getRootAgent();

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("  Acme Corp Customer Support  |  Powered by ADK-TS  ");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log('Type your question and press Enter. Type "exit" to quit.\n');
	console.log("Example questions to try:");
	console.log("  • What is your return policy?");
	console.log("  • How much does shipping cost?");
	console.log("  • Where is my order? My order number is 3");
	console.log("  • Look up my account, my user ID is 1");
	console.log("  • I need to speak to a human agent");
	console.log("");

	const prompt = () => {
		rl.question("You: ", async (input) => {
			const trimmed = input.trim();

			if (!trimmed) {
				prompt();
				return;
			}

			if (trimmed.toLowerCase() === "exit") {
				console.log("\nThank you for contacting Acme Corp support. Goodbye!\n");
				rl.close();
				return;
			}

			try {
				const response = await runner.ask(trimmed);
				console.log(`\nAgent: ${response}\n`);
			} catch (err) {
				console.error(
					"\nAgent error:",
					err instanceof Error ? err.message : err,
					"\n",
				);
			}

			prompt();
		});
	};

	prompt();
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
