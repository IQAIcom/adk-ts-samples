import { randomUUID } from "node:crypto";
import { createTool } from "@iqai/adk";
import { z } from "zod";
import type {
	CapitalGain,
	ClassifiedTransaction,
	TaxLot,
	TaxMethod,
} from "../types.js";
import { CONSTANTS, STATE_KEYS } from "../types.js";

/**
 * Calculate if a gain is short-term (<= 365 days) or long-term
 */
function isShortTerm(acquisitionDate: number, disposalDate: number): boolean {
	const daysDiff = (disposalDate - acquisitionDate) / (1000 * 60 * 60 * 24);
	return daysDiff <= CONSTANTS.SHORT_TERM_THRESHOLD_DAYS;
}

/**
 * Match disposals with acquisition lots and calculate gains/losses
 */
function calculateGains(
	disposals: ClassifiedTransaction[],
	taxLots: TaxLot[],
	method: TaxMethod,
): { gains: CapitalGain[]; updatedLots: TaxLot[] } {
	const gains: CapitalGain[] = [];
	const updatedLots = JSON.parse(JSON.stringify(taxLots)) as TaxLot[];

	// Pre-sort and group lots by token symbol for efficient lookup
	const lotsByToken = new Map<string, TaxLot[]>();
	for (const lot of updatedLots) {
		if (!lotsByToken.has(lot.tokenSymbol)) {
			lotsByToken.set(lot.tokenSymbol, []);
		}
		const tokenLots = lotsByToken.get(lot.tokenSymbol);
		if (tokenLots) {
			tokenLots.push(lot);
		}
	}

	// Sort each token's lots once by the specified method
	for (const [_symbol, lots] of lotsByToken) {
		lots.sort((a, b) => {
			switch (method) {
				case "FIFO":
					return a.acquisitionDate - b.acquisitionDate;
				case "LIFO":
					return b.acquisitionDate - a.acquisitionDate;
				case "HIFO":
					return b.costBasis / b.quantity - a.costBasis / a.quantity;
				default:
					return 0;
			}
		});
	}

	for (const disposal of disposals) {
		let remainingQuantity = disposal.quantity;
		const matchedLots: Array<{
			lotId: string;
			quantity: number;
			costBasis: number;
		}> = [];

		// Get pre-sorted available lots for this token
		const tokenSymbol = disposal.tokenSymbol || "UNKNOWN";
		const availableLots = (lotsByToken.get(tokenSymbol) || []).filter(
			(lot) => lot.remainingQuantity > 0,
		);

		// Match disposal with lots
		for (const lot of availableLots) {
			if (remainingQuantity <= 0) break;

			const quantityToMatch = Math.min(
				remainingQuantity,
				lot.remainingQuantity,
			);
			const costBasisForMatch =
				(lot.costBasis / lot.quantity) * quantityToMatch;

			matchedLots.push({
				lotId: lot.id,
				quantity: quantityToMatch,
				costBasis: costBasisForMatch,
			});

			// Update lot
			lot.remainingQuantity -= quantityToMatch;
			remainingQuantity -= quantityToMatch;
		}

		// Calculate total cost basis and gains
		const totalCostBasis = matchedLots.reduce(
			(sum, match) => sum + match.costBasis,
			0,
		);
		const proceeds = disposal.fairMarketValueUSD;
		const gainLoss = proceeds - totalCostBasis;

		// Determine if short-term or long-term
		// Use the oldest matched lot date for conservative calculation
		const oldestLotDate =
			matchedLots.length > 0
				? Math.min(
						...matchedLots.map((match) => {
							const lot = updatedLots.find((l) => l.id === match.lotId);
							return lot ? lot.acquisitionDate : disposal.timestamp;
						}),
					)
				: disposal.timestamp;

		gains.push({
			transactionHash: disposal.hash,
			disposalDate: disposal.timestamp,
			tokenSymbol: disposal.tokenSymbol || "UNKNOWN",
			quantity: disposal.quantity,
			proceeds,
			costBasis: totalCostBasis,
			gainLoss,
			shortTerm: isShortTerm(oldestLotDate, disposal.timestamp),
			method,
			matchedLots,
		});
	}

	return { gains, updatedLots };
}

/**
 * Tool: Calculate cost basis and capital gains/losses
 */
export const calculateCostBasisTool = createTool({
	name: "calculate_cost_basis",
	description:
		"Calculates capital gains and losses using the specified accounting method (FIFO, LIFO, or HIFO). Matches disposals with acquisition lots and determines short-term vs long-term gains.",
	schema: z.object({
		method: z
			.enum(["FIFO", "LIFO", "HIFO"])
			.default("FIFO")
			.describe("Accounting method to use for cost basis calculation"),
		year: z
			.number()
			.optional()
			.describe("Tax year to calculate for (filters transactions by year)"),
	}),
	fn: async ({ method, year }, { state }) => {
		try {
			// Get classified transactions from state
			const transactions: ClassifiedTransaction[] = state.get(
				STATE_KEYS.CLASSIFIED_TRANSACTIONS,
				[],
			);

			if (transactions.length === 0) {
				return {
					success: false,
					message:
						"No classified transactions found. Please import and classify transactions first.",
					error: "NO_TRANSACTIONS",
				};
			}

			// Filter by year if specified
			const filteredTransactions = year
				? transactions.filter((tx) => {
						const txYear = new Date(tx.timestamp * 1000).getFullYear();
						return txYear === year;
					})
				: transactions;

			// Separate acquisitions (BUY, INCOME, etc.) and disposals (SELL, SWAP out)
			const acquisitions = filteredTransactions.filter(
				(tx) =>
					tx.type === "BUY" ||
					tx.type === "INCOME" ||
					tx.type === "TRANSFER_IN" ||
					tx.type === "GIFT_RECEIVED",
			);

			const disposals = filteredTransactions.filter(
				(tx) =>
					tx.type === "SELL" ||
					tx.type === "SWAP" ||
					tx.type === "TRANSFER_OUT",
			);

			// Create tax lots from acquisitions
			const taxLots: TaxLot[] = acquisitions.map((tx) => ({
				id: randomUUID(),
				acquisitionDate: tx.timestamp,
				costBasis: tx.costBasisUSD || tx.fairMarketValueUSD,
				quantity: tx.quantity,
				remainingQuantity: tx.quantity,
				tokenSymbol: tx.tokenSymbol || "UNKNOWN",
				transactionHash: tx.hash,
			}));

			// Calculate gains
			const { gains, updatedLots } = calculateGains(disposals, taxLots, method);

			// Calculate totals
			const shortTermGains = gains
				.filter((g) => g.shortTerm)
				.reduce((sum, g) => sum + g.gainLoss, 0);

			const longTermGains = gains
				.filter((g) => !g.shortTerm)
				.reduce((sum, g) => sum + g.gainLoss, 0);

			// Store in state
			state.set(STATE_KEYS.TAX_LOTS, updatedLots);
			state.set(STATE_KEYS.CAPITAL_GAINS, gains);
			state.set(STATE_KEYS.TAX_METHOD, method);
			if (year) state.set(STATE_KEYS.TAX_YEAR, year);

			return {
				success: true,
				message: `Successfully calculated capital gains using ${method} method`,
				method,
				year: year || "all years",
				summary: {
					totalTransactions: filteredTransactions.length,
					acquisitions: acquisitions.length,
					disposals: disposals.length,
					totalGains: gains.length,
					shortTermGains: {
						count: gains.filter((g) => g.shortTerm).length,
						totalGainLoss: shortTermGains,
					},
					longTermGains: {
						count: gains.filter((g) => !g.shortTerm).length,
						totalGainLoss: longTermGains,
					},
					totalGainLoss: shortTermGains + longTermGains,
				},
				taxLotsRemaining: updatedLots.filter((lot) => lot.remainingQuantity > 0)
					.length,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				message: "Failed to calculate cost basis",
			};
		}
	},
});
