import { SequentialAgent } from "@iqai/adk";
import { getDataCollectionAgent } from "../data-collection-agent/agent";
import { getWriterAgent } from "../writer-agent/agent";

/**
 * Creates and configures the research workflow agent for the AI Research Assistant.
 *
 * This agent demonstrates a streamlined workflow coordinating two main agents:
 * 1. Data Collection Agent → gathers and extracts research data from web sources
 * 2. Writer Agent → generates both analysis and comprehensive reports simultaneously
 *
 * Parallel Processing Flow:
 * Data Collection → [Analysis Report + Comprehensive Report] (parallel)
 *
 * This showcases efficient parallel processing where multiple reports are generated
 * simultaneously from the collected research data.
 *
 * @returns The fully constructed sequential research workflow agent
 */

export const getResearchAgent = async () => {
  // Create main agents for the workflow
  const dataCollectionAgent = getDataCollectionAgent();
  const writerAgent = getWriterAgent();

  // Create Sequential Agent pipeline: collect data → generate reports
  const researchAgent = new SequentialAgent({
    name: "research_workflow_agent",
    description:
      "Orchestrates data collection followed by parallel report generation (analysis + comprehensive)",
    subAgents: [dataCollectionAgent, writerAgent],
  });

  return researchAgent;
};
