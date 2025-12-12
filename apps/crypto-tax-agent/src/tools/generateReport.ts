import { createTool } from "@iqai/adk";
import { z } from "zod";
import type { CapitalGain, ClassifiedTransaction } from "../types.js";
import { STATE_KEYS } from "../types.js";

/**
 * Format currency values
 */
function formatUSD(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

/**
 * Format date
 */
function formatDate(timestamp: number): string {
	return new Date(timestamp * 1000).toLocaleDateString("en-US");
}

/**
 * Generate IRS Form 8949 format
 */
function generateForm8949(gains: CapitalGain[], year: number): string {
	const shortTerm = gains.filter((g) => g.shortTerm);
	const longTerm = gains.filter((g) => !g.shortTerm);

	let report = `IRS FORM 8949 - Sales and Other Dispositions of Capital Assets\n`;
	report += `Tax Year: ${year}\n`;
	report += `${"=".repeat(100)}\n\n`;

	// Short-term gains
	if (shortTerm.length > 0) {
		report += `PART I - SHORT-TERM CAPITAL GAINS AND LOSSES\n`;
		report += `(Assets held one year or less)\n\n`;
		report += `${"Description".padEnd(30)} | ${"Date Acquired".padEnd(12)} | ${"Date Sold".padEnd(12)} | ${"Proceeds".padStart(15)} | ${"Cost Basis".padStart(15)} | ${"Gain/Loss".padStart(15)}\n`;
		report += `${"-".repeat(100)}\n`;

		for (const gain of shortTerm) {
			const oldestLot = gain.matchedLots[0];
			const description = `${gain.quantity.toFixed(6)} ${gain.tokenSymbol}`;
			const dateAcquired =
				oldestLot && gain.matchedLots.length > 0 ? "VARIOUS" : "UNKNOWN";
			const dateSold = formatDate(gain.disposalDate);

			report += `${description.padEnd(30)} | ${dateAcquired.padEnd(12)} | ${dateSold.padEnd(12)} | ${formatUSD(gain.proceeds).padStart(15)} | ${formatUSD(gain.costBasis).padStart(15)} | ${formatUSD(gain.gainLoss).padStart(15)}\n`;
		}

		const stTotal = shortTerm.reduce((sum, g) => sum + g.gainLoss, 0);
		report += `${"-".repeat(100)}\n`;
		report += `${"TOTAL SHORT-TERM".padEnd(84)} | ${formatUSD(stTotal).padStart(15)}\n\n`;
	}

	// Long-term gains
	if (longTerm.length > 0) {
		report += `PART II - LONG-TERM CAPITAL GAINS AND LOSSES\n`;
		report += `(Assets held more than one year)\n\n`;
		report += `${"Description".padEnd(30)} | ${"Date Acquired".padEnd(12)} | ${"Date Sold".padEnd(12)} | ${"Proceeds".padStart(15)} | ${"Cost Basis".padStart(15)} | ${"Gain/Loss".padStart(15)}\n`;
		report += `${"-".repeat(100)}\n`;

		for (const gain of longTerm) {
			const description = `${gain.quantity.toFixed(6)} ${gain.tokenSymbol}`;
			const dateAcquired = "VARIOUS";
			const dateSold = formatDate(gain.disposalDate);

			report += `${description.padEnd(30)} | ${dateAcquired.padEnd(12)} | ${dateSold.padEnd(12)} | ${formatUSD(gain.proceeds).padStart(15)} | ${formatUSD(gain.costBasis).padStart(15)} | ${formatUSD(gain.gainLoss).padStart(15)}\n`;
		}

		const ltTotal = longTerm.reduce((sum, g) => sum + g.gainLoss, 0);
		report += `${"-".repeat(100)}\n`;
		report += `${"TOTAL LONG-TERM".padEnd(84)} | ${formatUSD(ltTotal).padStart(15)}\n\n`;
	}

	return report;
}

/**
 * Generate CSV format
 */
function generateCSV(gains: CapitalGain[]): string {
	let csv =
		"Transaction Hash,Date Sold,Token,Quantity,Proceeds,Cost Basis,Gain/Loss,Term,Method\n";

	for (const gain of gains) {
		csv += `${gain.transactionHash},`;
		csv += `${formatDate(gain.disposalDate)},`;
		csv += `${gain.tokenSymbol},`;
		csv += `${gain.quantity},`;
		csv += `${gain.proceeds.toFixed(2)},`;
		csv += `${gain.costBasis.toFixed(2)},`;
		csv += `${gain.gainLoss.toFixed(2)},`;
		csv += `${gain.shortTerm ? "Short" : "Long"},`;
		csv += `${gain.method}\n`;
	}

	return csv;
}

/**
 * Generate summary report
 */
function generateSummary(
	gains: CapitalGain[],
	transactions: ClassifiedTransaction[],
	year?: number,
): string {
	const shortTerm = gains.filter((g) => g.shortTerm);
	const longTerm = gains.filter((g) => !g.shortTerm);

	const stTotal = shortTerm.reduce((sum, g) => sum + g.gainLoss, 0);
	const ltTotal = longTerm.reduce((sum, g) => sum + g.gainLoss, 0);
	const totalGainLoss = stTotal + ltTotal;

	const incomeEvents = transactions.filter((tx) => tx.type === "INCOME");
	const totalIncome = incomeEvents.reduce(
		(sum, tx) => sum + tx.fairMarketValueUSD,
		0,
	);

	let report = `CRYPTO TAX SUMMARY ${year ? `- ${year}` : ""}\n`;
	report += `${"=".repeat(60)}\n\n`;

	report += `CAPITAL GAINS/LOSSES:\n`;
	report += `  Short-Term (≤ 365 days):\n`;
	report += `    Transactions: ${shortTerm.length}\n`;
	report += `    Total: ${formatUSD(stTotal)}\n\n`;

	report += `  Long-Term (> 365 days):\n`;
	report += `    Transactions: ${longTerm.length}\n`;
	report += `    Total: ${formatUSD(ltTotal)}\n\n`;

	report += `  TOTAL GAIN/LOSS: ${formatUSD(totalGainLoss)}\n\n`;

	if (incomeEvents.length > 0) {
		report += `ORDINARY INCOME:\n`;
		report += `  Income Events: ${incomeEvents.length}\n`;
		report += `  Total Income: ${formatUSD(totalIncome)}\n\n`;
	}

	report += `${"=".repeat(60)}\n`;
	report += `\nDISCLAIMER: This report is for informational purposes only and does not\n`;
	report += `constitute tax advice. Please consult with a qualified tax professional.\n`;

	return report;
}

/**
 * Tool: Generate tax report
 */
export const generateReportTool = createTool({
	name: "generate_report",
	description:
		"Generates a tax report in the specified format (Form 8949, CSV, or Summary). Uses capital gains data from session state.",
	schema: z.object({
		format: z
			.enum(["8949", "CSV", "SUMMARY"])
			.default("SUMMARY")
			.describe("Report format: IRS Form 8949, CSV export, or Summary"),
		year: z
			.number()
			.optional()
			.describe(
				"Tax year for the report (if not specified, uses all available data)",
			),
	}),
	fn: async ({ format, year }, { state }) => {
		try {
			// Get data from state
			const gains: CapitalGain[] = state.get(STATE_KEYS.CAPITAL_GAINS, []);
			const transactions: ClassifiedTransaction[] = state.get(
				STATE_KEYS.CLASSIFIED_TRANSACTIONS,
				[],
			);
			const method = state.get(STATE_KEYS.TAX_METHOD, "FIFO");

			if (gains.length === 0) {
				return {
					success: false,
					message:
						"No capital gains calculated. Please calculate cost basis first.",
					error: "NO_GAINS",
				};
			}

			// Filter by year if specified
			const filteredGains = year
				? gains.filter((g) => {
						const gainYear = new Date(g.disposalDate * 1000).getFullYear();
						return gainYear === year;
					})
				: gains;

			if (filteredGains.length === 0 && year) {
				return {
					success: false,
					message: `No capital gains found for year ${year}`,
					error: "NO_GAINS_FOR_YEAR",
				};
			}

			// Generate report based on format
			let report: string;
			switch (format) {
				case "8949":
					report = generateForm8949(
						filteredGains,
						year || new Date().getFullYear(),
					);
					break;
				case "CSV":
					report = generateCSV(filteredGains);
					break;
				default:
					report = generateSummary(filteredGains, transactions, year);
					break;
			}

			// Calculate summary statistics
			const shortTermGains = filteredGains
				.filter((g) => g.shortTerm)
				.reduce((sum, g) => sum + g.gainLoss, 0);
			const longTermGains = filteredGains
				.filter((g) => !g.shortTerm)
				.reduce((sum, g) => sum + g.gainLoss, 0);

			return {
				success: true,
				message: `Successfully generated ${format} report`,
				format,
				year: year || "all years",
				method,
				report,
				summary: {
					totalShortTermGain: shortTermGains,
					totalLongTermGain: longTermGains,
					totalGainLoss: shortTermGains + longTermGains,
					transactionCount: filteredGains.length,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				message: "Failed to generate report",
			};
		}
	},
});
