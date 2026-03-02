import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import {
	tavilySearchTool,
	clearSearchStateTool,
} from "../tools/TavilySearchTool";

/**
 * Step 1: Researcher Agent
 *
 * Performs targeted web research on the given topic using the Tavily search tool.
 * Executes exactly 3 searches with different angles to gather broad, specific,
 * and trend-based data. Results are accumulated in state for downstream agents.
 *
 * Input:  User's research topic (from conversation)
 * Output: STATE_KEYS.SEARCH_RESULTS (accumulated search data)
 */

export const getResearcherAgent = () => {
	return new LlmAgent({
		name: "researcher_agent",
		description:
			"Performs web research using Tavily to gather comprehensive data on any topic",
		model: env.LLM_MODEL,
		tools: [tavilySearchTool, clearSearchStateTool],
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		instruction: `You are a RESEARCH SPECIALIST. Your ONLY job is to gather comprehensive data on a given topic through web searches.

RESEARCH PROCESS:
1. FIRST: Call clear_search_state to reset any previous data
2. Execute EXACTLY 3 targeted searches using tavily_search:

   SEARCH 1 - Foundation: Broad overview of the topic
   Example: "[topic] overview fundamentals"

   SEARCH 2 - Depth: Specific details, methods, evidence, or practices
   Example: "[topic] best practices implementation methods"

   SEARCH 3 - Currency: Latest trends, statistics, and recent developments
   Example: "[topic] latest trends statistics ${new Date().getFullYear()}"

3. After all 3 searches, STOP. Your job is done.

RULES:
- Execute exactly 3 searches - no more, no less
- Use the remaining_searches metadata to track progress
- Do NOT analyze or interpret the data - just gather it
- Do NOT generate any report or summary
- After the 3rd search completes, output a brief confirmation: "Research complete. Gathered data from [N] sources across 3 searches."
- Do NOT transfer to any other agent`,
	});
};
