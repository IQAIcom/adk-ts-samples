import { AgentBuilder } from "@iqai/adk";
import { getResearcherAgent } from "./researcher-agent/agent";
import { getAnalysisAgent } from "./analysis-report-agent/agent";
import { getRecommenderAgent } from "./recommender-agent/agent";
import { getWriterAgent } from "./writer-agent/agent";

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
 * Each step reads from state populated by prior steps, creating a clear
 * data pipeline where each agent builds on the work of previous agents.
 *
 * @returns A SequentialAgent instance that runs the full research pipeline
 */

export const getRootAgent = async () => {
	const researcherAgent = getResearcherAgent();
	const analysisAgent = getAnalysisAgent();
	const recommenderAgent = getRecommenderAgent();
	const writerAgent = getWriterAgent();

	return AgentBuilder.create("research_assistant")
		.withDescription(
			"Sequential research pipeline: research → analyze → recommend → write",
		)
		.asSequential([
			researcherAgent,
			analysisAgent,
			recommenderAgent,
			writerAgent,
		])
		.build();
};
