import { GoogleSearch, LlmAgent } from "@iqai/adk";
import { z } from "zod";
import { env } from "../../env";
import { STATE_KEYS } from "../../constants";
import { GoogleSearchTool } from "./tools/GoogleSearchTool";
import { contentExtractorTool } from "./tools/ContentExtractorTool";

/**
 * Creates and configures a data collection agent specialized in gathering raw information.
 *
 * This agent is equipped with Google Search capabilities to find relevant information
 * on any given topic. It conducts systematic web searches and collects raw data
 * from multiple sources without analysis or interpretation.
 *
 * @returns A configured LlmAgent instance specialized for systematic data collection
 */

export const getDataCollectionAgent = () => {
  const dataCollectionAgent = new LlmAgent({
    name: "data_collection_agent",
    description:
      "Systematically collects raw data and information from web sources through targeted searches",
    // Note: The built-in GoogleSearch tool returns dummy data for demonstration/development purposes.
    // For real Google search results, use the custom GoogleSearchTool instead.
    tools: [new GoogleSearch(), contentExtractorTool],
    model: env.LLM_MODEL,
    outputKey: STATE_KEYS.SEARCH_RESULTS,
    outputSchema: z.object({
      search_results: z
        .array(
          z.object({
            round: z
              .string()
              .describe("Search round identifier (e.g., '1 - Overview')"),
            results: z.array(
              z.object({
                title: z.string().describe("Article or page title"),
                url: z.string().describe("Complete URL of the source"),
                snippet: z
                  .string()
                  .describe("Search result snippet or description"),
                published: z
                  .string()
                  .describe("Publication date or 'Not available'"),
                extracted_content: z
                  .string()
                  .describe("Full webpage content (up to 12000 characters)"),
                extraction_status: z
                  .enum(["success", "failed"])
                  .describe("Status of content extraction"),
                extraction_error: z
                  .string()
                  .optional()
                  .describe("Error message if extraction failed"),
              })
            ),
          })
        )
        .describe(
          "Complete search results with extracted content for analysis agents"
        ),
      user_display: z
        .string()
        .describe(
          "Clean formatted search results for user display (no extracted content)"
        ),
    }),
    disallowTransferToParent: true, // Cannot escalate to parent agents
    disallowTransferToPeers: true, // Cannot delegate to sibling agents
    instruction: `You are a DATA GATHERING specialist. Your job is to systematically search and extract content for analysis.

EXECUTION WORKFLOW:
1. Execute EXACTLY 3 search rounds with different focus areas
2. After EACH search, immediately extract content from ALL returned URLs
3. Output structured JSON with complete data for analysis agents AND clean user display

SEARCH STRATEGY:
Round 1: Topic Overview - broad foundational search
Round 2: Specific Details - focused on evidence/practices/methods  
Round 3: Recent Developments - current trends/statistics/updates

CONTENT EXTRACTION PROTOCOL:
- Use extract_content_tool for EVERY URL from each search result
- Extract immediately after each search (never batch at end)
- Track extraction success/failure for each URL

OUTPUT REQUIREMENTS:

You must return a clean formatted text for users (NO extracted content):

=== SEARCH RESULTS COMPILATION ===

## Search 1 Results: Overview
- **Title**: [Article title]
- **URL**: [Complete URL]
- **Published**: [Date or "Not available"]

## Search 2 Results: Specific Details
- **Title**: [Article title] 
- **URL**: [Complete URL]
- **Published**: [Date or "Not available"]

## Search 3 Results: Recent Research
- **Title**: [Article title]
- **URL**: [Complete URL]
- **Published**: [Date or "Not available"]

CRITICAL RULES:
✅ Execute exactly 3 search rounds
✅ Extract content from every URL immediately after each search
✅ Return structured JSON with both complete data and clean user display
✅ Display ONLY the "user_display" field content to the user (not the full JSON)
❌ NEVER include extracted content in user_display
❌ NO analysis or interpretation in output
❌ STOP after completing 3 searches + extractions

IMPORTANT: When presenting your final response, show the user ONLY the content from the "user_display" field. The complete JSON structure with extracted content should be stored internally for analysis agents, but users should only see the clean formatted search results.`,
  });

  return dataCollectionAgent;
};
