import { getPortfolioAnalyzerAgent } from "./agents/portfolio-analyzer-agent/agent.js";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Main function demonstrating DeBank Portfolio Analyzer agent usage.
 */
async function main() {
	console.log("🚀 Starting Portfolio Analyzer Agent...\n");

	const { runner } = await getPortfolioAnalyzerAgent();

	try {
		const userInput1 = "Hi! Can you help me analyze my crypto portfolio?";
		console.log(`👤 User: ${userInput1}`);
		const greeting = await runner.ask(userInput1);
		console.log(`🤖 Agent: ${greeting}\n`);

		// Note: Using a sample address for demonstration purposes.
		const userInput2 =
			"My wallet address is 0x1dfC530A9B3955d62D16359110E3cf385d47b1a9. What's my total balance across all chains?";
		console.log(`👤 User: ${userInput2}`);
		const totalBalance = await runner.ask(userInput2);
		console.log(`🤖 Agent: ${totalBalance}\n`);

		const userInput3 = "Can you show me my DeFi protocol positions?";
		console.log(`👤 User: ${userInput3}`);
		const protocols = await runner.ask(userInput3);
		console.log(`🤖 Agent: ${protocols}\n`);

		const userInput4 = "What NFTs do I have in this wallet?";
		console.log(`👤 User: ${userInput4}`);
		const nfts = await runner.ask(userInput4);
		console.log(`🤖 Agent: ${nfts}\n`);

		const userInput5 =
			"Give me a summary of my portfolio distribution and any high-risk exposures you see.";
		console.log(`👤 User: ${userInput5}`);
		const summary = await runner.ask(userInput5);
		console.log(`🤖 Agent: ${summary}\n`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

main().catch(console.error);

export { getPortfolioAnalyzerAgent };
export default main;
