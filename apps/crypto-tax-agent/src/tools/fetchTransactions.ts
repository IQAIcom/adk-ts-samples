import { createTool } from "@iqai/adk";
import { z } from "zod";
import {
	fetchAllTransactions,
	isExplorerConfigured,
} from "../services/explorerService.js";
import { STATE_KEYS } from "../types.js";

/**
 * Tool: Fetch transactions for a wallet address
 *
 * This tool fetches both normal and token transactions from blockchain explorers
 * (Etherscan, Basescan, etc.) using real APIs. If no API key is configured,
 * it falls back to mock data for demonstration purposes.
 */
export const fetchTransactionsTool = createTool({
	name: "fetch_transactions",
	description:
		"Fetches blockchain transactions for a given wallet address from specified chain. Uses real blockchain explorer APIs (Etherscan, Basescan) when API keys are configured. Fetches both native token (ETH) and ERC20 token transactions. Stores results in session state for further processing.",
	schema: z.object({
		address: z
			.string()
			.regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address")
			.describe("Wallet address to fetch transactions for"),
		chain: z
			.enum(["ethereum", "base", "fraxtal"])
			.describe("Blockchain network to fetch from"),
		startDate: z
			.string()
			.optional()
			.describe("ISO date string for start of period (e.g., 2024-01-01)"),
		endDate: z
			.string()
			.optional()
			.describe("ISO date string for end of period (e.g., 2024-12-31)"),
		includeTokens: z
			.boolean()
			.optional()
			.default(true)
			.describe("Whether to include ERC20 token transactions (default: true)"),
	}),
	fn: async (
		{ address, chain, startDate, endDate, includeTokens },
		{ state },
	) => {
		try {
			// Store user address for classification
			const userAddresses = state.get(STATE_KEYS.USER_ADDRESSES, []);
			if (!userAddresses.includes(address.toLowerCase())) {
				state.set(STATE_KEYS.USER_ADDRESSES, [
					...userAddresses,
					address.toLowerCase(),
				]);
			}

			// Check if explorer is configured
			if (!isExplorerConfigured(chain)) {
				return {
					success: false,
					error: `No API key configured for ${chain}`,
					message: `Cannot fetch transactions without API key`,
					hint: `Add ETHERSCAN_API_KEY to .env for real transaction data.`,
				};
			}

			// Fetch real transactions from explorer
			console.log(`Fetching transactions for ${address} on ${chain}...`);
			const transactions = await fetchAllTransactions(address, chain, {
				startDate,
				endDate,
				includeTokens,
			});

			// Store in state (append to existing transactions)
			const existing = state.get(STATE_KEYS.RAW_TRANSACTIONS, []);
			const updated = [...existing, ...transactions];
			state.set(STATE_KEYS.RAW_TRANSACTIONS, updated);

			// Calculate date range from actual transactions
			let actualDateRange: any;
			if (transactions.length > 0) {
				const timestamps = transactions.map((tx) => tx.timestamp);
				const minTimestamp = Math.min(...timestamps);
				const maxTimestamp = Math.max(...timestamps);
				actualDateRange = {
					start: new Date(minTimestamp * 1000).toISOString().split("T")[0],
					end: new Date(maxTimestamp * 1000).toISOString().split("T")[0],
				};
			}

			return {
				success: true,
				message: `Successfully fetched ${transactions.length} transactions from ${chain}`,
				transactionCount: transactions.length,
				chain,
				address,
				dateRange: actualDateRange || {
					start: startDate || "earliest",
					end: endDate || "latest",
				},
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				message: "Failed to fetch transactions",
				hint: "Check your API key configuration and network connectivity",
			};
		}
	},
});
