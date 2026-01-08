import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * DAO Proposal Analyzer Demo
 *
 * This demo showcases a multi-agent system for DAO governance analysis:
 * 1. Root Agent - Handles user interaction and fetches on-chain proposal data
 * 2. Analysis Workflow Agent - Coordinates sequential analysis pipeline:
 *    a. Proposal Analyzer - Deep analysis of proposal details
 *    b. Vote Recommender - Synthesizes recommendation with reasoning
 *
 * The system fetches real on-chain governance data from Ethereum mainnet:
 * - Compound, Uniswap, ENS, Aave (Governor Bravo contracts)
 */

async function main() {
	const { runner } = await getRootAgent();

	console.log("==============================\n");
	console.log("DAO Proposal Analyzer");
	console.log("==============================\n");

	try {
		// Step 1: Initial greeting
		console.log("--- Step 1: Greeting ---\n");
		const userInput1 = "Hello!";
		console.log(`User: ${userInput1}`);
		const greeting = await runner.ask(userInput1);
		console.log(`Agent: ${greeting}\n`);

		// Step 2: User asks about supported DAOs (uses get_supported_daos tool)
		console.log("--- Step 2: List Supported DAOs ---\n");
		const userInput2 = "What DAOs do you support?";
		console.log(`User: ${userInput2}`);
		const daosResponse = await runner.ask(userInput2);
		console.log(`Agent: ${daosResponse}\n`);

		// Step 3: User wants to see Compound proposals (uses list_proposals tool)
		console.log("--- Step 3: List Recent Proposals ---\n");
		const userInput3 = "Show me recent Compound proposals";
		console.log(`User: ${userInput3}`);
		const compoundResponse = await runner.ask(userInput3);
		console.log(`Agent: ${compoundResponse}\n`);

		// Step 4: User requests full analysis of the latest proposal
		console.log("--- Step 4: Analyze Latest Proposal ---\n");
		const userInput4 =
			"Analyze the latest Compound proposal and give me a voting recommendation";
		console.log(`User: ${userInput4}`);
		const analysisResponse = await runner.ask(userInput4);
		console.log(`Agent: ${analysisResponse}\n`);
	} catch (error) {
		console.error(`Error:`, error);
		console.log(`\n${"=".repeat(80)}\n`);
	}
}

main().catch(console.error);
