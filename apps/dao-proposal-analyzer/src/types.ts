/**
 * Type definitions for DAO Proposal Analyzer
 */

/**
 * On-chain proposal data structure
 */
export interface ProposalData {
	id: string;
	dao: string;
	proposer: string;
	title: string;
	description: string;
	status: string;
	forVotes: string;
	againstVotes: string;
	abstainVotes: string;
	quorum: string;
	startBlock: number;
	endBlock: number;
	eta: number;
	canceled: boolean;
	executed: boolean;
	targets: string[];
	values: string[];
	signatures: string[];
	calldatas: string[];
	createdAt: string;
}

/**
 * Proposal analysis result
 */
export interface ProposalAnalysis {
	summary: string;
	category: string;
	riskLevel: "low" | "medium" | "high" | "critical";
	technicalComplexity: "simple" | "moderate" | "complex";
	stakeholderImpact: {
		tokenHolders: string;
		protocol: string;
		ecosystem: string;
	};
	keyChanges: string[];
	potentialRisks: string[];
	opportunities: string[];
}

/**
 * Vote recommendation result
 */
export interface VoteRecommendation {
	recommendation: "for" | "against" | "abstain";
	confidence: "low" | "medium" | "high";
	reasoning: string[];
	considerations: {
		pros: string[];
		cons: string[];
	};
	disclaimer: string;
}

/**
 * DAO configuration
 */
export interface DAOConfig {
	name: string;
	governor: string;
	token: string;
}
