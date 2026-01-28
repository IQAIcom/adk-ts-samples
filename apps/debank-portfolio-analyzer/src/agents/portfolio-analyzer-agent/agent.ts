import { AgentBuilder } from "@iqai/adk"
import { getDebankTools } from "./tools"
import { env } from "../../env"
import dedent from "dedent"


export async function getPortfolioAnalyzerAgent() {
    const debankTools = await getDebankTools();
    return AgentBuilder.create("portfolio_analyzer_agent")
        .withModel(env.LLM_MODEL)
        .withDescription(
            "AI-powered portfolio analyzer that helps users analyze their crypto portfolios using Debank Platform",
        )
        .withInstruction(
            dedent`
    You are a portfolio analyzer AI assistant that helps users understand and analyze their crypto portfolios.
    You retrieve on-chain and DeFi data such as wallet balances, token holdings, protocol positions,
    NFTs, and activity history using DeBank data sources.

    Your responsibilities include:
    - Fetching accurate portfolio data using the available MCP tools.
    - Asking for required inputs (such as wallet address, chain_id, or token identifiers) before invoking tools.
    - Explaining results clearly and concisely in a way that is useful for portfolio analysis.
    - Handling unsupported chains, missing data, or partial results gracefully.
    - Avoiding assumptions and never fabricating data when information is unavailable.
    - Presenting summaries that help users assess exposure, distribution, and recent activity.

    Prefer efficient and relevant queries, and focus on providing reliable insights
    based strictly on retrieved data.
  `
        )
        .withTools(...debankTools)
        .build()
}