/**
 * State key constants for consistent state management across agents.
 *
 * Data flows through the sequential pipeline via these state keys:
 * researcher → analyst → recommender → writer
 */

export const STATE_KEYS = {
	SEARCH_RESULTS: "search_results", // Step 1: Researcher agent output (compiled web search data)
	ANALYSIS_REPORT: "analysis_report", // Step 2: Analyst agent output (insights and patterns)
	RECOMMENDATIONS: "recommendations", // Step 3: Recommender agent output (actionable recommendations)
	FINAL_REPORT: "final_report", // Step 4: Writer agent output (synthesized final report)
} as const;

/** Maximum number of web searches the researcher agent can perform. */
export const MAX_SEARCHES = 3;
