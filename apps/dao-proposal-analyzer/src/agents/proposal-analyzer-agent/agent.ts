import { LlmAgent } from "@iqai/adk";
import { STATE_KEYS } from "../../constants";
import { env } from "../../env";

/**
 * Creates and configures the Proposal Analyzer Agent.
 *
 * This agent specializes in deep analysis of DAO proposals, examining:
 * - Technical implementation details
 * - Risk assessment and security implications
 * - Stakeholder impact analysis
 */
export const getProposalAnalyzerAgent = () => {
	return new LlmAgent({
		name: "proposal_analyzer_agent",
		description:
			"Analyzes DAO proposals to extract key insights, assess risks, and evaluate technical complexity and stakeholder impact",
		model: env.LLM_MODEL,
		outputKey: STATE_KEYS.PROPOSAL_ANALYSIS,
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		instruction: `You are a DAO GOVERNANCE ANALYST. Provide a BRIEF, focused analysis of proposals.

PROPOSAL DATA: {${STATE_KEYS.PROPOSAL_DATA}?}

RULES:
- Be CONCISE - max 200 words total
- No fluff or repetition
- Analyze the data above, don't request more
- Include the proposal URL if available in the data

OUTPUT FORMAT (use exactly this structure):

**Summary**: 1-2 sentences on what this proposal does.

**Category**: [Treasury | Protocol Upgrade | Parameter Change | Governance | Grants]

**Risk Level**: [Low | Medium | High] - one sentence why.

**Key Changes**:
- Change 1
- Change 2

**Main Concerns**: 1-2 bullet points max.

**Opportunities**: 1-2 bullet points max.

**View Full Proposal**: [Include the proposal URL from the data if available]

---

CRITICAL: Be brief. Complete analysis and STOP. Always end with the separator line (---) after the URL.`,
	});
};
