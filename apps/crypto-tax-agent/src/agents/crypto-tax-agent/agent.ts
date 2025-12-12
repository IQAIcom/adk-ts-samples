import { AgentBuilder } from "@iqai/adk";
import { env } from "../../env.js";
import { calculateCostBasisTool } from "../../tools/calculateCostBasis.js";
import { classifyTransactionTool } from "../../tools/classifyTransaction.js";
import { fetchTransactionsTool } from "../../tools/fetchTransactions.js";
import { generateReportTool } from "../../tools/generateReport.js";

/**
 * Create the Crypto Tax Agent
 *
 * This agent helps users calculate crypto taxes by:
 * 1. Fetching on-chain transactions from blockchain explorers
 * 2. Classifying transactions into tax event types
 * 3. Calculating cost basis using FIFO, LIFO, or HIFO methods
 * 4. Generating tax reports in various formats
 */
export async function getCryptoTaxAgent() {
	return AgentBuilder.create("crypto_tax_assistant")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"AI-powered crypto tax assistant that helps calculate capital gains and generate tax reports",
		)
		.withInstruction(`
You are a crypto tax assistant that helps users calculate their cryptocurrency taxes.

Your workflow:
1. **Import Transactions**: Use fetch_transactions to get blockchain transactions for user's wallet addresses
2. **Classify**: Use classify_transactions to categorize transactions as BUY, SELL, SWAP, INCOME, etc.
3. **Calculate**: Use calculate_cost_basis to compute capital gains/losses using the specified method (FIFO, LIFO, or HIFO)
4. **Report**: Use generate_report to create tax reports in various formats (Form 8949, CSV, or Summary)

Important Guidelines:
- Always ask for: wallet addresses, tax year, and preferred accounting method (default: FIFO)
- Support multiple chains: Ethereum, Base, Fraxtal
- Tax methods:
  * FIFO (First In First Out) - most common, oldest assets sold first
  * LIFO (Last In First Out) - newest assets sold first
  * HIFO (Highest In First Out) - highest cost basis first (minimizes gains)
- Short-term gains (≤365 days holding period) are taxed as ordinary income
- Long-term gains (>365 days) have preferential tax rates

Example interaction:
User: "Calculate my 2024 crypto taxes for address 0x123..."
You:
1. Confirm details (address, chain, year, method)
2. Fetch transactions using fetch_transactions
3. Classify them using classify_transactions
4. Calculate gains using calculate_cost_basis
5. Generate report using generate_report
6. Present summary and offer detailed reports
`)
		.withTools(
			fetchTransactionsTool,
			classifyTransactionTool,
			calculateCostBasisTool,
			generateReportTool,
		)
		.build();
}

export default getCryptoTaxAgent;
