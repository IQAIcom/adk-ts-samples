import { ParallelAgent } from "@iqai/adk";
import { getAnalysisAgent } from "../analysis-report-agent/agent";
import { getReportAgent } from "../comprehensive-report-agent/agent";

/**
 * Creates and configures a writing agent that produces two reports simultaneously.
 *
 * This agent takes search results and creates two parallel reports:
 * 1. Analysis Report - detailed analysis and insights from the research data
 * 2. Comprehensive Report - complete research report with recommendations
 *
 * Both reports are generated simultaneously for efficiency.
 *
 * @returns A ParallelAgent instance that produces both analysis and comprehensive reports
 */

export const getWriterAgent = () => {
  // Create specialist sub-agents for parallel report generation
  const analysisAgent = getAnalysisAgent();
  const reportAgent = getReportAgent();

  // Create Parallel Agent for simultaneous report generation
  const writerAgent = new ParallelAgent({
    name: "writer_workflow_agent",
    description:
      "Generates both analysis and comprehensive reports simultaneously from research data",
    subAgents: [analysisAgent, reportAgent],
  });

  return writerAgent;
};
