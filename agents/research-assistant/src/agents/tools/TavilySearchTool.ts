import { createTool } from "@iqai/adk";
import { tavily as createTavilyClient } from "@tavily/core";
import { z } from "zod";
import { STATE_KEYS } from "../../constants";

/**
 * Tavily Search Tool that allows web searching.
 * Returns search results with URLs and their content in a single call.
 * Accumulates results in state for access by subsequent agents.
 */

export const tavilySearchTool = createTool({
  name: "tavily_search",
  description:
    "Search the web using Tavily and return results with URLs and content",
  schema: z.object({
    query: z.string().describe("The search query to execute"),
    clearState: z
      .boolean()
      .optional()
      .describe(
        "Whether to clear previous search results (for new research sessions)"
      ),
  }),
  fn: async ({ query, clearState = false }, { state }) => {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

    // If no API key, return mock data for development
    if (!TAVILY_API_KEY) {
      return {
        query,
        follow_up_questions: null,
        answer: null,
        images: [],
        results: [
          {
            url: `https://example.com/search?q=${encodeURIComponent(query)}`,
            title: `Mock result for: ${query}`,
            content: `This is mock content for '${query}'. Set TAVILY_API_KEY to get real results.`,
            score: 0.5,
            raw_content:
              "<html><head><title>Test</title></head><body>Mock content</body></html>",
          },
        ],
        response_time: 0,
        request_id: "mock-0",
      };
    }

    const tavily = createTavilyClient({ apiKey: TAVILY_API_KEY });

    // Perform the web search and include the content of the URLs in the results
    const response = await tavily.search(query, {
      includeRawContent: "markdown", // To get the content in markdown format
      maxResults: 2, // Limit to top 2 results for brevity
    });

    // Get existing search results from state or initialize empty array
    const existingResults = state.get(STATE_KEYS.SEARCH_RESULTS) || [];

    // Clear previous results if requested (for new research sessions)
    if (clearState) {
      console.log(
        `🔄 Clearing previous search results for new research session (${
          Array.isArray(existingResults) ? existingResults.length : 0
        } results found)`
      );
      state.set(STATE_KEYS.SEARCH_RESULTS, []);
    }

    // Check if we already have 3 searches for the current session - prevent excessive searching
    const currentResults = state.get(STATE_KEYS.SEARCH_RESULTS) || [];
    if (Array.isArray(currentResults) && currentResults.length >= 3) {
      console.log(
        `⚠️  Search limit reached: ${currentResults.length} searches already completed for this research session. Skipping additional search for: ${query}`
      );
      return {
        query,
        results: [],
        message:
          "Search limit reached - maximum 3 searches allowed per research session",
      };
    }

    // Add this search round to the accumulated results
    const searchRound = {
      query: query,
      timestamp: new Date().toISOString(),
      results: response.results || [],
      response_time: response.responseTime || 0,
      search_number: existingResults.length + 1,
    };

    const updatedResults = Array.isArray(existingResults)
      ? [...existingResults, searchRound]
      : [searchRound];

    // Save accumulated results to state
    state.set(STATE_KEYS.SEARCH_RESULTS, updatedResults);

    console.log(
      `🔍 Search ${searchRound.search_number}/3 completed for query: ${query}`
    );

    return response;
  },
});
