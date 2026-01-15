import { SequentialAgent } from "@iqai/adk";
import { getProposalAnalyzerAgent } from "../proposal-analyzer-agent/agent";
import { getVoteRecommenderAgent } from "../vote-recommender-agent/agent";

/**
 * Creates and configures the Analysis Workflow Agent.
 *
 * This agent orchestrates the sequential analysis workflow:
 * 1. Proposal Analyzer - Deep dive into proposal details and risks
 * 2. Vote Recommender - Synthesize analysis into voting recommendation
 *
 * The sequential flow ensures the vote recommender has access to the analysis.
 *
 * @returns A SequentialAgent instance that coordinates the analysis pipeline
 */
export const getAnalysisWorkflowAgent = () => {
	const proposalAnalyzer = getProposalAnalyzerAgent();
	const voteRecommender = getVoteRecommenderAgent();

	return new SequentialAgent({
		name: "analysis_workflow_agent",
		description:
			"Coordinates DAO proposal analysis workflow: analysis → recommendation",
		subAgents: [proposalAnalyzer, voteRecommender],
	});
};
