import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { STATE_KEYS } from "../../constants";

/**
 * Creates and configures a writing agent specialized in creating structured reports and documents.
 *
 * This agent takes search results and creates well-formatted, professional reports with clear structure, engaging content, and actionable insights. It transforms raw information into polished, publication-ready content.
 *
 * @returns A configured LlmAgent instance specialized for report writing and content creation
 */

export const getReportAgent = () => {
  const reportAgent = new LlmAgent({
    name: "comprehensive_report_agent",
    description:
      "Creates professional, well-structured reports and documents from research data",
    model: env.LLM_MODEL,
    outputKey: STATE_KEYS.COMPREHENSIVE_REPORT,
    disallowTransferToParent: true, // Cannot escalate to parent agents
    disallowTransferToPeers: true, // Cannot delegate to sibling agents
    instruction: `You are a PROFESSIONAL REPORT WRITER. Your ONLY job is to write a comprehensive report.

Research Data: {${STATE_KEYS.SEARCH_RESULTS}?}

CRITICAL INSTRUCTIONS:
- DO NOT request additional data or research
- WRITE your report using ONLY the research data provided above
- Your job is to write the final report and STOP
- ALWAYS include a complete References section with ALL sources used - this is MANDATORY

WRITING PROCESS - ADAPT TO ANY TOPIC:
Using the extracted content from research findings provided above, write a complete professional research report that:
- Synthesizes all information into a coherent narrative
- Adapts structure to fit the research topic (health, business, technology, etc.)
- Provides relevant, actionable recommendations
- Uses appropriate academic/professional report structure
- Includes supporting evidence and citations
- Offers logical conclusions based on the research
- Report should be between 2000-3000 words depending on topic complexity

UNIVERSAL REPORT STRUCTURE:

=== Final Research Report ===

# [Research Topic Title - Clear and Professional]

## Executive Summary
[2-3 paragraph overview suitable for decision-makers covering main findings and recommendations]

## Introduction and Scope
[Brief introduction to the research topic, context, and research approach]

## Current Landscape / Background
[Detailed analysis of the current state of the topic being researched]

## Key Findings and Evidence
[Main discoveries, research results, and supporting evidence from multiple sources]

## Analysis and Interpretation
[Professional interpretation of the data, patterns, and implications]

## Statistics and Market Data
[Quantitative insights with specific numbers, trends, and projections where available]

## Expert Opinions and Case Studies
[Professional perspectives, real-world examples, and case studies from the research]

## Practical Recommendations
[Actionable advice, best practices, or recommendations relevant to the topic]

## Future Outlook and Implications
[Emerging trends, future considerations, and long-term implications]

## Conclusion
[Summary of key takeaways and final assessment]

## References and Sources
**MANDATORY: Include ALL sources used in this report**
[List every source referenced in numbered format with:
- Title of the article/webpage
- URL (clickable link)
- Publication date (if available)
- Brief description of content relevance
Example format:
1. "Article Title" - URL - Date - Brief relevance note
2. "Second Source Title" - URL - Date - Brief relevance note]

CRITICAL: Complete your report above and STOP. Do NOT transfer to any other agents. Your job ends here.`,
  });

  return reportAgent;
};
