/**
 * State key constants for consistent state management across agents.
 *
 * Data flows through the sequential pipeline via these state keys:
 * researcher → analyst → recommender → writer
 */

export const STATE_KEYS = {
	SEARCH_RESULTS: "search_results", // Step 1: Researcher agent output (accumulated web search data)
	SEARCH_PROGRESS: "search_progress", // Step 1: Metadata for tracking search progress
	ANALYSIS_REPORT: "analysis_report", // Step 2: Analyst agent output (insights and patterns)
	RECOMMENDATIONS: "recommendations", // Step 3: Recommender agent output (actionable recommendations)
	FINAL_REPORT: "final_report", // Step 4: Writer agent output (synthesized final report)
} as const;

export const MAX_SEARCHES_PER_SESSION = 3;
