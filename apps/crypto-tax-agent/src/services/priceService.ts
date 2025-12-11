import { env } from "../env.js";
import type { Chain } from "../types.js";

const COINGECKO_API_BASE = env.COINGECKO_API_KEY
	? "https://pro-api.coingecko.com/api/v3"
	: "https://api.coingecko.com/api/v3";

const CHAIN_PLATFORM_IDS: Record<Chain, string> = {
	ethereum: "ethereum",
	base: "base",
	fraxtal: "fraxtal",
};

const TOKEN_SYMBOL_TO_ID: Record<string, string> = {
	ETH: "ethereum",
	WETH: "weth",
	USDC: "usd-coin",
	USDT: "tether",
	DAI: "dai",
	WBTC: "wrapped-bitcoin",
	BTC: "bitcoin",
	MATIC: "matic-network",
	LINK: "chainlink",
	UNI: "uniswap",
	AAVE: "aave",
	COMP: "compound-governance-token",
	MKR: "maker",
	SNX: "havven",
	CRV: "curve-dao-token",
	SUSHI: "sushi",
	YFI: "yearn-finance",
};

interface PriceCache {
	[key: string]: {
		price: number;
		timestamp: number;
	};
}

const priceCache: PriceCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (env.COINGECKO_API_KEY) {
		headers["x-cg-pro-api-key"] = env.COINGECKO_API_KEY;
	}

	return headers;
}

async function getCoinId(
	tokenSymbol: string,
	tokenAddress?: string,
	chain?: Chain,
): Promise<string | null> {
	if (TOKEN_SYMBOL_TO_ID[tokenSymbol.toUpperCase()]) {
		return TOKEN_SYMBOL_TO_ID[tokenSymbol.toUpperCase()];
	}

	if (tokenAddress && chain) {
		try {
			const platformId = CHAIN_PLATFORM_IDS[chain];
			const url = `${COINGECKO_API_BASE}/coins/${platformId}/contract/${tokenAddress}`;

			const response = await fetch(url, {
				headers: getHeaders(),
			});

			if (response.ok) {
				const data = (await response.json()) as { id: string };
				return data.id;
			}
		} catch (error) {
			console.warn(
				`Failed to fetch coin ID for ${tokenSymbol} at ${tokenAddress}:`,
				error,
			);
		}
	}

	try {
		const url = `${COINGECKO_API_BASE}/search?query=${tokenSymbol}`;
		const response = await fetch(url, {
			headers: getHeaders(),
		});

		if (response.ok) {
			const data = (await response.json()) as { coins?: Array<{ id: string }> };
			if (data.coins && data.coins.length > 0) {
				return data.coins[0].id;
			}
		}
	} catch (error) {
		console.warn(`Failed to search for coin ${tokenSymbol}:`, error);
	}

	return null;
}

export async function fetchHistoricalPrice(
	tokenSymbol: string,
	timestamp: number,
	tokenAddress?: string,
	chain?: Chain,
): Promise<number | null> {
	const cacheKey = `${tokenSymbol}-${timestamp}`;
	if (priceCache[cacheKey]) {
		const cached = priceCache[cacheKey];
		if (Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.price;
		}
	}

	try {
		const coinId = await getCoinId(tokenSymbol, tokenAddress, chain);
		if (!coinId) {
			console.warn(`Could not find CoinGecko ID for ${tokenSymbol}`);
			return null;
		}
		const date = new Date(timestamp * 1000);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		const dateString = `${day}-${month}-${year}`;

		const url = `${COINGECKO_API_BASE}/coins/${coinId}/history?date=${dateString}`;
		const response = await fetch(url, {
			headers: getHeaders(),
		});

		if (!response.ok) {
			if (response.status === 429) {
				console.warn("CoinGecko API rate limit exceeded");
			}
			return null;
		}

		const data = (await response.json()) as {
			market_data?: { current_price?: { usd?: number } };
		};
		const price = data.market_data?.current_price?.usd;

		if (price) {
			priceCache[cacheKey] = {
				price,
				timestamp: Date.now(),
			};
			return price;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching historical price for ${tokenSymbol}:`, error);
		return null;
	}
}

export async function fetchCurrentPrice(
	tokenSymbol: string,
	tokenAddress?: string,
	chain?: Chain,
): Promise<number | null> {
	try {
		const coinId = await getCoinId(tokenSymbol, tokenAddress, chain);
		if (!coinId) {
			console.warn(`Could not find CoinGecko ID for ${tokenSymbol}`);
			return null;
		}
		const url = `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`;
		const response = await fetch(url, {
			headers: getHeaders(),
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as Record<string, { usd?: number }>;
		return data[coinId]?.usd || null;
	} catch (error) {
		console.error(`Error fetching current price for ${tokenSymbol}:`, error);
		return null;
	}
}

export async function fetchPriceWithFallback(
	tokenSymbol: string,
	timestamp: number,
	tokenAddress?: string,
	chain?: Chain,
): Promise<{ price: number; source: "coingecko" } | null> {
	const realPrice = await fetchHistoricalPrice(
		tokenSymbol,
		timestamp,
		tokenAddress,
		chain,
	);

	if (realPrice !== null) {
		return { price: realPrice, source: "coingecko" };
	}

	console.warn(
		`Unable to fetch price for ${tokenSymbol} at timestamp ${timestamp} (CoinGecko unavailable)`,
	);
	return null;
}
