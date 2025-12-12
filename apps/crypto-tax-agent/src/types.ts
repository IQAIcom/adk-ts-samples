export type TaxMethod = "FIFO" | "LIFO" | "HIFO";

export type TransactionType =
	| "BUY"
	| "SELL"
	| "SWAP"
	| "TRANSFER_IN"
	| "TRANSFER_OUT"
	| "INCOME" // staking, airdrops, mining
	| "GIFT_RECEIVED"
	| "GIFT_SENT"
	| "UNKNOWN";

export type Chain = "ethereum" | "base" | "fraxtal";

export interface RawTransaction {
	hash: string;
	chain: Chain;
	timestamp: number;
	from: string;
	to: string;
	value: string; // in wei
	tokenSymbol?: string;
	tokenAddress?: string;
	gasUsed: string;
	gasPrice: string;
	blockNumber: number;
}

export interface ClassifiedTransaction extends RawTransaction {
	type: TransactionType;
	costBasisUSD?: number;
	fairMarketValueUSD: number;
	quantity: number; // Parsed amount in token units
	isTaxable: boolean;
}

export interface TaxLot {
	id: string;
	acquisitionDate: number;
	costBasis: number; // USD
	quantity: number;
	remainingQuantity: number;
	tokenSymbol: string;
	transactionHash: string;
}

export interface CapitalGain {
	transactionHash: string;
	disposalDate: number;
	tokenSymbol: string;
	quantity: number;
	proceeds: number; // USD
	costBasis: number; // USD
	gainLoss: number; // USD
	shortTerm: boolean; // < 1 year
	method: TaxMethod;
	matchedLots: Array<{
		lotId: string;
		quantity: number;
		costBasis: number;
	}>;
}

export interface TaxReport {
	year: number;
	method: TaxMethod;
	totalShortTermGain: number;
	totalLongTermGain: number;
	totalGainLoss: number;
	transactions: ClassifiedTransaction[];
	capitalGains: CapitalGain[];
	incomeEvents: ClassifiedTransaction[];
	warnings: string[];
}

export const STATE_KEYS = {
	RAW_TRANSACTIONS: "raw_transactions",
	CLASSIFIED_TRANSACTIONS: "classified_transactions",
	TAX_LOTS: "tax_lots",
	CAPITAL_GAINS: "capital_gains",
	TAX_REPORT: "tax_report",
	USER_ADDRESSES: "user_addresses",
	TAX_YEAR: "tax_year",
	TAX_METHOD: "tax_method",
} as const;

export const CONSTANTS = {
	SHORT_TERM_THRESHOLD_DAYS: 365,
	DEFAULT_TAX_METHOD: "FIFO" as TaxMethod,
	SUPPORTED_CHAINS: ["ethereum", "base", "fraxtal"] as const,
} as const;
