import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { STATE_KEYS } from "../../constants";

/**
 * Creates and configures an analysis agent specialized in analyzing and synthesizing complex information.
 *
 * This agent takes search results with URLs and extracted content, and performs deep analysis
 * to extract key insights, identify patterns, and synthesize information into structured
 * analytical outputs that inform decision-making.
 *
 * @returns A configured LlmAgent instance specialized for data analysis and synthesis
 */

export const getAnalysisAgent = () => {
  const analysisAgent = new LlmAgent({
    name: "analysis_report_agent",
    description:
      "Analyzes and synthesizes content summaries to extract key insights, patterns, and structured analytical outputs",
    model: env.LLM_MODEL,
    outputKey: STATE_KEYS.ANALYSIS_REPORT,
    disallowTransferToParent: true, // Cannot escalate to parent agents
    disallowTransferToPeers: true, // Cannot delegate to sibling agents
    instruction: `You are an ANALYSIS and SYNTHESIS specialist. Your job is to analyze research data on ANY topic and extract meaningful insights.

Research Data: {${STATE_KEYS.SEARCH_RESULTS}?}}

CRITICAL INSTRUCTIONS:
- DO NOT ask for more data or suggest additional research
- ANALYZE the research data provided above (includes search results AND extracted content) for ANY topic domain
- Adapt your analysis approach based on the research topic (health, technology, business, social issues, etc.)

UNIVERSAL ANALYSIS PROCESS:
1. Identify the research topic from the content summaries
2. Extract key insights relevant to that topic domain
3. Identify patterns, trends, and important data points
4. Assess information quality and reliability
5. Provide structured analysis in the format below

Required output format:

=== RESEARCH ANALYSIS ===

## Critical Insights Identified:
• [Key insight 1 - what does the research reveal about this topic?]
• [Key insight 2 - what evidence supports or contradicts common beliefs?]
• [Key insight 3 - what are the implications for stakeholders?]
• [Key insight 4 - what knowledge gaps or opportunities exist?]

## Key Statistics and Data Points:
• [Important quantitative findings with context]
• [Significant statistics from credible sources]
• [Relevant numerical trends or comparisons]
• [Percentages, rates, or measurements that matter]

## Emerging Patterns and Themes:
• [Consistent theme 1 - what appears repeatedly across sources?]
• [Trending pattern 2 - what's developing or changing?]
• [Concerning issue 3 - what challenges or risks emerge?]
• [Opportunity pattern 4 - what positive developments are noted?]

## Expert Consensus and Disagreements:
• [Areas where sources agree]
• [Points of debate or conflicting evidence]
• [Gaps in expert opinion or research]

## Information Quality Assessment:
[Evaluation of source credibility, data recency, research methodology, and potential limitations]

CRITICAL: Complete your analysis above and STOP. Do NOT transfer to any other agents. Your job ends here.`,
  });

  return analysisAgent;
};
