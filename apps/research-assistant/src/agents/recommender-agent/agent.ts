import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { STATE_KEYS } from "../../constants";

/**
 * Step 3: Recommender Agent
 *
 * Reads both raw research data and the analysis report to produce actionable,
 * prioritized recommendations. Bridges the gap between analysis and action
 * by translating insights into practical guidance.
 *
 * Input:  STATE_KEYS.SEARCH_RESULTS + STATE_KEYS.ANALYSIS_REPORT
 * Output: STATE_KEYS.RECOMMENDATIONS (actionable recommendations)
 */

export const getRecommenderAgent = () => {
	return new LlmAgent({
		name: "recommender_agent",
		description:
			"Produces actionable, prioritized recommendations based on research data and analysis",
		model: env.LLM_MODEL,
		outputKey: STATE_KEYS.RECOMMENDATIONS,
		disallowTransferToParent: true,
		disallowTransferToPeers: true,
		instruction: `You are a RECOMMENDATIONS SPECIALIST. Your ONLY job is to produce actionable recommendations based on research and analysis.

RESEARCH DATA:
{${STATE_KEYS.SEARCH_RESULTS}}

ANALYSIS REPORT:
{${STATE_KEYS.ANALYSIS_REPORT}}

RECOMMENDATION PROCESS:
Using the research data and analysis above, produce prioritized recommendations that:
- Translate analytical insights into practical, actionable guidance
- Prioritize recommendations by impact and feasibility
- Provide specific implementation steps where possible
- Address risks identified in the analysis
- Consider different stakeholder perspectives
- Include both immediate actions and long-term strategies

OUTPUT FORMAT (600-1000 words):

=== RECOMMENDATIONS ===

# [Topic] - Recommendations

## High Priority (Immediate Action)
1. **[Recommendation title]**
   - What: [Specific action to take]
   - Why: [Evidence from research/analysis supporting this]
   - How: [Brief implementation guidance]

2. **[Recommendation title]**
   - What: [Specific action]
   - Why: [Supporting evidence]
   - How: [Implementation guidance]

## Medium Priority (Short-term)
1. **[Recommendation title]**
   - What: [Specific action]
   - Why: [Supporting evidence]
   - How: [Implementation guidance]

## Long-term Strategic Considerations
- [Forward-looking recommendation based on trends]
- [Strategic positioning advice]

## Key Risks to Monitor
- [Risk identified in analysis with mitigation suggestion]
- [Emerging threat or challenge to watch]

RULES:
- Base ALL recommendations on the provided research data and analysis
- Be specific and actionable - avoid vague advice
- Prioritize by impact: what will make the biggest difference first?
- Do NOT repeat the analysis - focus purely on "what to do about it"
- Complete your recommendations and STOP`,
	});
};
