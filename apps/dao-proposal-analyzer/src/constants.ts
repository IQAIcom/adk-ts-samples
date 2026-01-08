/**
 * State key constants for consistent state management across agents
 */
export const STATE_KEYS = {
	// Proposal data
	PROPOSAL_DATA: "proposal_data",
	PROPOSAL_HISTORY: "proposal_history",

	// Analysis outputs
	PROPOSAL_ANALYSIS: "proposal_analysis",
	VOTE_RECOMMENDATION: "vote_recommendation",

	// Workflow tracking
	ANALYSIS_PROGRESS: "analysis_progress",
} as const;

/**
 * Supported DAO governance protocols with their contract addresses
 * All DAOs use Governor Bravo on Ethereum mainnet
 */
export const SUPPORTED_DAOS = {
	// Compound Governor Bravo
	COMPOUND: {
		name: "Compound",
		governor: "0xc0Da02939E1441F497fd74F78cE7Decb17B66529",
		token: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
		chain: "Ethereum",
	},
	// Uniswap Governor Bravo
	UNISWAP: {
		name: "Uniswap",
		governor: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
		token: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
		chain: "Ethereum",
	},
	// ENS Governor
	ENS: {
		name: "ENS",
		governor: "0x323A76393544d5ecca80cd6ef2A560C6a395b7E3",
		token: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
		chain: "Ethereum",
	},
	// Aave Governance V3
	AAVE: {
		name: "Aave",
		governor: "0x9AEE0B04504CeF83A65AC3f0e838D0593BCb2BC7",
		token: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
		chain: "Ethereum",
	},
} as const;

/**
 * Proposal states according to Governor Bravo
 */
export const PROPOSAL_STATES = [
	"Pending",
	"Active",
	"Canceled",
	"Defeated",
	"Succeeded",
	"Queued",
	"Expired",
	"Executed",
] as const;
