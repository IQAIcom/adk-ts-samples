import { env } from "../env.js";
import type { Chain, RawTransaction } from "../types.js";

interface ExplorerConfig {
	chainId: number;
	nativeSymbol: string;
}

const EXPLORER_CONFIGS: Record<Chain, ExplorerConfig> = {
	ethereum: {
		chainId: 1,
		nativeSymbol: "ETH",
	},
	base: {
		chainId: 8453,
		nativeSymbol: "ETH",
	},
	fraxtal: {
		chainId: 252,
		nativeSymbol: "FRAX",
	},
};

const ETHERSCAN_V2_BASE_URL = "https://api.etherscan.io/v2/api";

interface EtherscanTransaction {
	blockNumber: string;
	timeStamp: string;
	hash: string;
	from: string;
	to: string;
	value: string;
	gas: string;
	gasPrice: string;
	gasUsed: string;
	isError: string;
	contractAddress?: string;
}

interface EtherscanTokenTransaction {
	blockNumber: string;
	timeStamp: string;
	hash: string;
	from: string;
	to: string;
	value: string;
	tokenName: string;
	tokenSymbol: string;
	tokenDecimal: string;
	contractAddress: string;
	gas: string;
	gasPrice: string;
	gasUsed: string;
}

async function fetchNormalTransactions(
	address: string,
	chain: Chain,
	startBlock: number = 0,
	endBlock: number = 99999999,
): Promise<RawTransaction[]> {
	const config = EXPLORER_CONFIGS[chain];

	if (!env.ETHERSCAN_API_KEY) {
		console.warn(
			`No Etherscan API key configured. Skipping normal transactions for ${chain}.`,
		);
		return [];
	}

	try {
		const url = new URL(ETHERSCAN_V2_BASE_URL);
		url.searchParams.append("chainid", config.chainId.toString());
		url.searchParams.append("module", "account");
		url.searchParams.append("action", "txlist");
		url.searchParams.append("address", address);
		url.searchParams.append("startblock", startBlock.toString());
		url.searchParams.append("endblock", endBlock.toString());
		url.searchParams.append("sort", "asc");
		url.searchParams.append("apikey", env.ETHERSCAN_API_KEY);

		console.log(`Fetching normal transactions from URL: ${url.toString()}`);

		const response = await fetch(url.toString());
		const data = (await response.json()) as {
			status: string;
			message?: string;
			result: EtherscanTransaction[] | string;
		};

		if (data.status !== "1" || !Array.isArray(data.result)) {
			if (data.message === "No transactions found") {
				return [];
			}
			throw new Error(data.message || "Failed to fetch transactions");
		}

		// Convert Etherscan format to RawTransaction format
		return data.result.map((tx: EtherscanTransaction) => ({
			hash: tx.hash,
			chain,
			timestamp: parseInt(tx.timeStamp, 10),
			from: tx.from,
			to: tx.to || "",
			value: tx.value,
			tokenSymbol: config.nativeSymbol,
			tokenAddress: undefined,
			gasUsed: tx.gasUsed,
			gasPrice: tx.gasPrice,
			blockNumber: parseInt(tx.blockNumber, 10),
		}));
	} catch (error) {
		console.error(`Error fetching normal transactions from ${chain}:`, error);
		throw error;
	}
}

async function fetchTokenTransactions(
	address: string,
	chain: Chain,
	startBlock: number = 0,
	endBlock: number = 99999999,
): Promise<RawTransaction[]> {
	const config = EXPLORER_CONFIGS[chain];

	if (!env.ETHERSCAN_API_KEY) {
		console.warn(
			`No Etherscan API key configured. Skipping token transactions for ${chain}.`,
		);
		return [];
	}

	try {
		const url = new URL(ETHERSCAN_V2_BASE_URL);
		url.searchParams.append("chainid", config.chainId.toString());
		url.searchParams.append("module", "account");
		url.searchParams.append("action", "tokentx");
		url.searchParams.append("address", address);
		url.searchParams.append("startblock", startBlock.toString());
		url.searchParams.append("endblock", endBlock.toString());
		url.searchParams.append("sort", "asc");
		url.searchParams.append("apikey", env.ETHERSCAN_API_KEY);

		console.log(`Fetching token transactions from URL: ${url.toString()}`);

		const response = await fetch(url.toString());
		const data = (await response.json()) as {
			status: string;
			message?: string;
			result: EtherscanTokenTransaction[] | string;
		};

		if (data.status !== "1" || !Array.isArray(data.result)) {
			if (data.message === "No transactions found") {
				return [];
			}
			throw new Error(data.message || "Failed to fetch token transactions");
		}

		// Convert Etherscan format to RawTransaction format
		return data.result.map((tx: EtherscanTokenTransaction) => ({
			hash: tx.hash,
			chain,
			timestamp: parseInt(tx.timeStamp, 10),
			from: tx.from,
			to: tx.to,
			value: tx.value,
			tokenSymbol: tx.tokenSymbol,
			tokenAddress: tx.contractAddress,
			gasUsed: tx.gasUsed,
			gasPrice: tx.gasPrice,
			blockNumber: parseInt(tx.blockNumber, 10),
		}));
	} catch (error) {
		console.error(`Error fetching token transactions from ${chain}:`, error);
		throw error;
	}
}

async function dateToBlockNumber(
	dateString: string,
	chain: Chain,
	closest: "before" | "after" = "before",
): Promise<number> {
	const config = EXPLORER_CONFIGS[chain];
	const date = new Date(dateString);
	const timestamp = Math.floor(date.getTime() / 1000);

	if (!env.ETHERSCAN_API_KEY) {
		throw new Error("ETHERSCAN_API_KEY is required for block number lookup");
	}

	const url = new URL(ETHERSCAN_V2_BASE_URL);
	url.searchParams.append("chainid", config.chainId.toString());
	url.searchParams.append("module", "block");
	url.searchParams.append("action", "getblocknobytime");
	url.searchParams.append("timestamp", timestamp.toString());
	url.searchParams.append("closest", closest);
	url.searchParams.append("apikey", env.ETHERSCAN_API_KEY);

	console.log(
		`Converting ${dateString} (timestamp: ${timestamp}) to block number on ${chain}...`,
	);

	const response = await fetch(url.toString());
	const data = (await response.json()) as {
		status: string;
		message?: string;
		result: string;
	};

	if (data.status !== "1") {
		const errorMessage =
			data.message || "Failed to get block number by timestamp";

		const isFutureDate = timestamp > Math.floor(Date.now() / 1000);

		if (isFutureDate) {
			console.log(`  → Date is in the future, using latest block`);
		}

		throw new Error(errorMessage);
	}

	const blockNumber = parseInt(data.result, 10);
	console.log(
		`  → ${dateString} corresponds to block #${blockNumber} on ${chain}`,
	);

	return blockNumber;
}

export async function fetchAllTransactions(
	address: string,
	chain: Chain,
	options: {
		startDate?: string;
		endDate?: string;
		includeTokens?: boolean;
	} = {},
): Promise<RawTransaction[]> {
	const { startDate, endDate, includeTokens = true } = options;

	const startBlock = startDate
		? await dateToBlockNumber(startDate, chain, "after")
		: 0;

	let endBlock = 99999999; // Default to maximum block number
	if (endDate) {
		try {
			endBlock = await dateToBlockNumber(endDate, chain, "before");
		} catch (_error) {
			// If endDate is in the future or fails, use the maximum block number
			console.warn(
				`Could not convert endDate to block number (date may be in the future). Using latest available blocks.`,
			);
		}
	}

	try {
		const [normalTxs, tokenTxs] = await Promise.all([
			fetchNormalTransactions(address, chain, startBlock, endBlock),
			includeTokens
				? fetchTokenTransactions(address, chain, startBlock, endBlock)
				: Promise.resolve([]),
		]);

		// Combine and deduplicate by hash
		const allTxs = [...normalTxs, ...tokenTxs];
		const uniqueTxs = Array.from(
			new Map(allTxs.map((tx) => [tx.hash, tx])).values(),
		);
		uniqueTxs.sort((a, b) => a.timestamp - b.timestamp);

		return uniqueTxs;
	} catch (error) {
		console.error(
			`Error fetching transactions for ${address} on ${chain}:`,
			error,
		);
		throw error;
	}
}

export function isExplorerConfigured(_chain: Chain): boolean {
	return env.ETHERSCAN_API_KEY !== undefined;
}

export function getExplorerConfig(chain: Chain): ExplorerConfig {
	return EXPLORER_CONFIGS[chain];
}
