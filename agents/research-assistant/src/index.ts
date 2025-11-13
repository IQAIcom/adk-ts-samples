import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";
import { STATE_KEYS } from "./constants";

dotenv.config();

/**
 * This demo shows how two main agents work together to process a topic:
 * 1. Data Collection Agent - Produces raw research findings and extracted content from web searches
 * 2. Writer Agent - Produces both analysis and comprehensive reports simultaneously
 *
 * The data collection agent saves search results with extracted content to state.
 * The writer agent (ParallelAgent) then generates two reports in parallel from this data.
 */

async function main() {
  const { runner, session, sessionService } = await getRootAgent();

  console.log("==============================\n");
  console.log("🔬 AI Research Assistant");
  console.log("==============================\n");

  // Run the research query through the agent workflow
  try {
    // Initial greeting
    const userInput1 = "Hi there!";
    console.log(`👤 User: ${userInput1}`);
    const greeting = await runner.ask(userInput1);
    console.log(`🤖 Agent: ${greeting}\n`);

    // User provides research topic
    const userInput2 =
      "Can you help me research about cybersecurity for small businesses?";
    console.log(`👤 User: ${userInput2}`);
    const topicResponse = await runner.ask(userInput2);
    console.log(`🤖 Agent: ${topicResponse}\n`);

    // User confirms to proceed
    const userInput3 = "Yes, please proceed!";
    console.log(`👤 User: ${userInput3}`);
    const result = await runner.ask(userInput3);
    console.log(`🤖 Agent: ${result}\n`);

    // TODO Remove the debug logs
    //  Retrieve the updated session to access the latest state
    const updatedSession = await sessionService.getSession(
      session.appName,
      session.userId,
      session.id
    );

    // Display Data Collection results
    console.log("\n" + "=".repeat(80));
    console.log("🔬 DATA COLLECTION RESULTS:");
    console.log("=".repeat(80));
    console.log(
      updatedSession?.state[STATE_KEYS.SEARCH_RESULTS] ||
        "No research findings found"
    );
  } catch (error) {
    console.error(`❌ Error processing research request:`, error);
    console.log("\n" + "=".repeat(80) + "\n");
  }
}

main().catch(console.error);
