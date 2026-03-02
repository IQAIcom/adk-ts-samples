import { AgentBuilder, InMemoryMemoryService } from "@iqai/adk";
import { getResearcherAgent } from "./researcher-agent/agent";
import { getAnalysisAgent } from "./analysis-report-agent/agent";
import { getRecommenderAgent } from "./recommender-agent/agent";
import { getWriterAgent } from "./writer-agent/agent";
import { MAX_SEARCHES_PER_SESSION } from "../constants";

/**
 * Creates and configures the root Research Assistant agent.
 *
 * This is a SequentialAgent that orchestrates a 4-step research pipeline:
 *
 *   Step 1: Researcher  → Gathers web data via Tavily search
 *   Step 2: Analyst     → Extracts insights, patterns, and key findings
 *   Step 3: Recommender → Produces actionable, prioritized recommendations
 *   Step 4: Writer      → Synthesizes everything into a final comprehensive report
 *
 * Framework features demonstrated:
 * - SequentialAgent for pipeline orchestration
 * - Session state initialization with `app:` prefix for app-level config
 * - Before/after agent callbacks for pipeline progress tracking (on sub-agents)
 * - Memory service for storing and recalling past research sessions
 *
 * @returns A BuiltAgent with runner, session, and memory service
 */

export const getRootAgent = async () => {
	const researcherAgent = getResearcherAgent();
	const analysisAgent = getAnalysisAgent();
	const recommenderAgent = getRecommenderAgent();
	const writerAgent = getWriterAgent();

	// Memory service allows recalling past research sessions.
	// Uses InMemoryMemoryService for this sample — swap with a
	// persistent implementation (e.g. database-backed) for production.
	const memoryService = new InMemoryMemoryService();

	return (
		AgentBuilder.create("research_assistant")
			.withDescription(
				"Sequential research pipeline: research → analyze → recommend → write",
			)
			.asSequential([
				researcherAgent,
				analysisAgent,
				recommenderAgent,
				writerAgent,
			])
			// Initialize session state with app-level configuration.
			// The `app:` prefix makes these values shared across all sessions.
			.withQuickSession({
				appName: "research_assistant",
				userId: "user",
				state: {
					"app:max_searches": MAX_SEARCHES_PER_SESSION,
					"app:pipeline_steps": [
						"researcher",
						"analyst",
						"recommender",
						"writer",
					],
				},
			})
			.withMemory(memoryService)
			.build()
	);
};
