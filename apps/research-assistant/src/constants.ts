/**
 * State key constants for consistent state management across agents
 */

export const STATE_KEYS = {
	SEARCH_RESULTS: "search_results", // Tavily search tool output (accumulated search results)
	SEARCH_PROGRESS: "search_progress", // Metadata for tracking search progress and remaining quota
	ANALYSIS_REPORT: "analysis_report", // Analysis Agent output
	COMPREHENSIVE_REPORT: "comprehensive_report", // Report Agent output
} as const;

export const MAX_SEARCHES_PER_SESSION = 3;
