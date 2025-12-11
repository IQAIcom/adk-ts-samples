import { createTool } from "@iqai/adk";
import { formatEther } from "viem";
import { z } from "zod";
import { fetchPriceWithFallback } from "../services/priceService.js";
import type {
	ClassifiedTransaction,
	RawTransaction,
	TransactionType,
} from "../types.js";
import { STATE_KEYS } from "../types.js";

/**
 * Classify a transaction based on its properties
 */
function classifyTransactionType(
	tx: RawTransaction,
	userAddresses: string[],
): TransactionType {
	const fromUser = userAddresses.includes(tx.from.toLowerCase());
	const toUser = userAddresses.includes(tx.to.toLowerCase());

	// Self-transfer (same address or between user's addresses)
	if (fromUser && toUser) {
		return "TRANSFER_IN"; // Treat as neutral
	}

	// Receiving funds
	if (!fromUser && toUser) {
		// Could be BUY, INCOME, or GIFT_RECEIVED
		// For simplicity, default to TRANSFER_IN
		// In production, analyze contract interactions
		return "TRANSFER_IN";
	}

	// Sending funds
	if (fromUser && !toUser) {
		// Could be SELL, SWAP, or TRANSFER_OUT
		// For simplicity, default to TRANSFER_OUT
		return "TRANSFER_OUT";
	}

	return "UNKNOWN";
}

/**
 * Determine if transaction is taxable
 */
function isTaxableTransaction(type: TransactionType): boolean {
	// Taxable events: SELL, SWAP (disposal), INCOME
	return type === "SELL" || type === "SWAP" || type === "INCOME";
}

/**
 * Tool: Classify raw transactions into tax event types
 *
 * This tool uses real CoinGecko price data when available, with fallback to mock prices.
 */
export const classifyTransactionTool = createTool({
	name: "classify_transactions",
	description:
		"Classifies raw blockchain transactions into tax event types (BUY, SELL, SWAP, INCOME, etc.) and determines taxability. Enriches with fair market value in USD using CoinGecko historical price data.",
	schema: z.object({
		autoClassify: z
			.boolean()
			.default(true)
			.describe(
				"Automatically classify all transactions in state. If false, only returns statistics.",
			),
	}),
	fn: async ({ autoClassify }, { state }) => {
		try {
			// Get raw transactions and user addresses from state
			const rawTransactions: RawTransaction[] = state.get(
				STATE_KEYS.RAW_TRANSACTIONS,
				[],
			);
			const userAddresses: string[] = state.get(STATE_KEYS.USER_ADDRESSES, []);

			if (rawTransactions.length === 0) {
				return {
					success: false,
					message: "No transactions found. Please fetch transactions first.",
					error: "NO_TRANSACTIONS",
				};
			}

			if (userAddresses.length === 0) {
				return {
					success: false,
					message: "No user addresses found. Please provide wallet addresses.",
					error: "NO_USER_ADDRESSES",
				};
			}

			if (!autoClassify) {
				return {
					success: true,
					message: "Transaction statistics",
					transactionCount: rawTransactions.length,
					userAddresses: userAddresses.length,
				};
			}

			// Classify transactions with real price data
			const classifiedTransactions: ClassifiedTransaction[] = [];
			let pricesFetched = 0;
			let pricesFailed = 0;

			for (const tx of rawTransactions) {
				const type = classifyTransactionType(tx, userAddresses);
				const isTaxable = isTaxableTransaction(type);

				// Parse quantity from wei to ether
				const quantity = parseFloat(formatEther(BigInt(tx.value)));

				// Fetch real price data
				const priceResult = await fetchPriceWithFallback(
					tx.tokenSymbol || "ETH",
					tx.timestamp,
					tx.tokenAddress,
					tx.chain,
				);

				let priceUSD = 0;
				if (priceResult !== null) {
					priceUSD = priceResult.price;
					pricesFetched++;
				} else {
					pricesFailed++;
					console.warn(
						`Unable to fetch price for ${tx.tokenSymbol} in transaction ${tx.hash}`,
					);
				}

				const fairMarketValueUSD = quantity * priceUSD;

				classifiedTransactions.push({
					...tx,
					type,
					quantity,
					fairMarketValueUSD,
					costBasisUSD:
						type === "BUY" || type === "TRANSFER_IN"
							? fairMarketValueUSD
							: undefined,
					isTaxable,
				});
			}

			// Store in state
			state.set(STATE_KEYS.CLASSIFIED_TRANSACTIONS, classifiedTransactions);

			// Generate statistics
			const typeCount = classifiedTransactions.reduce(
				(acc, tx) => {
					acc[tx.type] = (acc[tx.type] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			const taxableCount = classifiedTransactions.filter(
				(tx) => tx.isTaxable,
			).length;

			return {
				success: true,
				message: `Successfully classified ${classifiedTransactions.length} transactions`,
				statistics: {
					total: classifiedTransactions.length,
					taxable: taxableCount,
					nonTaxable: classifiedTransactions.length - taxableCount,
					byType: typeCount,
				},
				priceData: {
					pricesFetched,
					pricesFailed,
					message:
						pricesFailed > 0
							? `Fetched ${pricesFetched} prices successfully, ${pricesFailed} failed (configure COINGECKO_API_KEY for better results)`
							: `Successfully fetched all ${pricesFetched} prices from CoinGecko`,
				},
				warnings: classifiedTransactions
					.filter((tx) => tx.type === "UNKNOWN")
					.map((tx) => `Transaction ${tx.hash} could not be classified`),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				message: "Failed to classify transactions",
			};
		}
	},
});
