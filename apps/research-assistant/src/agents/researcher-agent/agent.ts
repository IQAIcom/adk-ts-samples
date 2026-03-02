import { LlmAgent, WebSearchTool } from "@iqai/adk";
import type { BaseTool, ToolContext } from "@iqai/adk";
import { env } from "../../env";
import { STATE_KEYS, MAX_SEARCHES } from "../../constants";
import { beforeAgentCallback, afterAgentCallback } from "../../callbacks";

/**
 * Step 1: Researcher Agent
 *
 * Performs targeted web research on the given topic using the built-in
 * WebSearchTool. Executes exactly 3 searches with different angles to
 * gather broad, specific, and trend-based data.
 *
 * Uses the framework's WebSearchTool (powered by Tavily) instead of a
 * custom tool — demonstrating how to leverage built-in tools.
 *
 * A beforeToolCallback enforces the MAX_SEARCHES limit at the framework
 * level. When the limit is reached, the callback returns an override
 * response that tells the LLM to stop searching and compile results —
 * this is more reliable than relying on the LLM to count its own tool calls.
 *
 * Input:  User's research topic (from conversation)
 * Output: STATE_KEYS.SEARCH_RESULTS (compiled research data via outputKey)
 */

/**
 * Before-tool callback that enforces the search limit.
 *
 * Tracks the number of web_search calls in temp state. Once the limit is
 * reached, returns an override response instead of executing the tool —
 * the LLM sees the message and moves on to compiling results.
 */
const enforceSearchLimit = async (
	_tool: BaseTool,
	_args: Record<string, any>,
	toolContext: ToolContext,
) => {
	const count = (toolContext.state["temp:search_count"] as number) || 0;

	if (count >= MAX_SEARCHES) {
		return {
			result: `Search limit reached (${MAX_SEARCHES}/${MAX_SEARCHES}). Do NOT search again. Compile all the research data you have gathered into the structured summary format now.`,
		};
	}

	toolContext.state["temp:search_count"] = count + 1;
	return undefined; // Allow normal execution
};

export const getResearcherAgent = () => {
	return new LlmAgent({
		name: "researcher_agent",
		description:
			"Performs web research using the built-in WebSearchTool to gather comprehensive data on any topic",
		model: env.LLM_MODEL,
		tools: [new WebSearchTool()],
		outputKey: STATE_KEYS.SEARCH_RESULTS,
		beforeAgentCallback,
		afterAgentCallback,
		beforeToolCallback: enforceSearchLimit,
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		instruction: `You are a RESEARCH SPECIALIST. Your ONLY job is to gather comprehensive data on a given topic through web searches.

RESEARCH PROCESS:
Execute EXACTLY 3 targeted searches using web_search:

   SEARCH 1 - Foundation: Broad overview of the topic
   Example query: "[topic] overview fundamentals"

   SEARCH 2 - Depth: Specific details, methods, evidence, or practices
   Example query: "[topic] best practices implementation methods"

   SEARCH 3 - Currency: Latest trends, statistics, and recent developments
   Example query: "[topic] latest trends statistics ${new Date().getFullYear()}"

For each search, use these parameters:
- maxResults: 3
- includeRawContent: "markdown"

After all 3 searches complete, compile ALL results into a structured summary:

=== RESEARCH DATA ===

## Search 1: [query used]
For each result:
- **Title**: [title]
- **URL**: [url]
- **Content**: [key content/findings]

## Search 2: [query used]
[Same format]

## Search 3: [query used]
[Same format]

## Research Summary
- Total sources found: [count]
- Search queries used: [list all 3]
- Date of research: [today's date]

RULES:
- Execute exactly 3 searches - no more, no less
- Do NOT analyze or interpret the data - just gather and compile it
- Do NOT generate recommendations or reports
- Include ALL source URLs and titles for proper attribution
- After compiling your research summary, STOP
- Do NOT transfer to any other agent`,
	});
};
