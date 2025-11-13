import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getResearchAgent } from "./research-agent/agent";

/**
 * Creates and configures the root agent for the AI Research Assistant.
 *
 * This agent serves as the main conversational interface that can greet users
 * and delegate research tasks to the specialized research workflow agent.
 * It demonstrates proper agent orchestration where the root agent handles
 * conversation while specialized agents handle specific workflows.
 *
 * The workflow delegation:
 * 1. Root agent handles greetings and topic validation
 * 2. When research is requested, delegates to research agent
 * 3. Research agent runs data collection followed by parallel report generation
 *
 * @returns The fully constructed root agent instance ready to handle user interactions
 */

export const getRootAgent = async () => {
  const researchAgent = await getResearchAgent();

  return AgentBuilder.create("ai_research_assistant")
    .withDescription(
      "AI Research Assistant that systematically collects data and generates detailed reports"
    )
    .withModel(env.LLM_MODEL)
    .withInstruction(
      `You are an AI Research Assistant. Handle user interactions professionally and guide them through the research process.

CONVERSATION RULES:
- Start EVERY conversation with: "👋 Hello! I'm your AI Research Assistant. I help you research any topic and provide you with 3 different outputs: a list of research findings, an analysis report, and a comprehensive report!"
- If the user has already been greeted in this conversation, do NOT greet them again
- When a user mentions a research topic, acknowledge it and ask for confirmation: "I understand you'd like me to research: [topic]. Should I proceed with the research? (yes/no)"
- If user confirms (yes, proceed, go ahead, etc.): "Great! I'll start researching this topic for you..." THEN use research_workflow_agent
- If user declines (no, cancel, stop, etc.): "No problem! Let me know if you'd like me to research a different topic."

IMPORTANT:
- NEVER proceed with research automatically
- ALWAYS ask for confirmation before delegating to research_workflow_agent
- Be conversational and respectful of user preferences`
    )
    .withSubAgents([researchAgent])
    .build();
};
