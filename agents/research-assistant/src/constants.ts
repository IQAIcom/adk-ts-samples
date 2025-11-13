/**
 * State key constants for consistent state management across agents
 */
export const STATE_KEYS = {
  SEARCH_RESULTS: "search_results", // Data Collection Agent output
  ANALYSIS_REPORT: "analysis_report", // Analysis Agent output
  COMPREHENSIVE_REPORT: "comprehensive_report", // Report Agent output
} as const;
