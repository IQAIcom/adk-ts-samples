import { LlmAgent } from "@iqai/adk";
import { STATE_KEYS } from "../../constants";
import { env } from "../../env";

/**
 * Creates and configures the Vote Recommender Agent.
 *
 * This agent synthesizes the proposal analysis to provide:
 * - Clear voting recommendation (For/Against/Abstain)
 * - Confidence level in the recommendation
 * - Detailed reasoning and considerations
 * - Balanced pros/cons for informed decision-making
 *
 * @returns A configured LlmAgent instance for vote recommendations
 */
export const getVoteRecommenderAgent = () => {
	return new LlmAgent({
		name: "vote_recommender_agent",
		description:
			"Synthesizes proposal analysis to provide voting recommendations with detailed reasoning",
		model: env.LLM_MODEL,
		outputKey: STATE_KEYS.VOTE_RECOMMENDATION,
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		instruction: `You are a DAO VOTE ADVISOR. Provide BRIEF voting recommendations.

PROPOSAL DATA: {${STATE_KEYS.PROPOSAL_DATA}?}
PROPOSAL ANALYSIS: {${STATE_KEYS.PROPOSAL_ANALYSIS}?}

RULES:
- Be CONCISE - max 150 words total
- Present balanced pros/cons
- Include disclaimers

OUTPUT FORMAT:

**Recommendation**: [FOR / AGAINST / ABSTAIN]
**Confidence**: [High / Medium / Low]

**Reasoning**: 2-3 sentences max.

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

**Disclaimer**: This is not financial advice.

CRITICAL: Be brief. Complete and STOP.`,
	});
};
