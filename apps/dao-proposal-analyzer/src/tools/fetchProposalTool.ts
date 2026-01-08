import { createTool } from "@iqai/adk";
import { z } from "zod";
import { STATE_KEYS, SUPPORTED_DAOS } from "../constants";
import {
	calculateVotingStats,
	formatVotes,
	getProposal,
	getProposalCount,
	getRecentProposals,
} from "../services/governanceService";

/**
 * Tool to fetch a specific proposal from a DAO by ID
 */
export const fetchProposalTool = createTool({
	name: "fetch_proposal",
	description:
		"Fetch a specific DAO proposal by ID from on-chain governance contracts. Supports Compound, Uniswap, ENS, and Aave on Ethereum mainnet.",
	schema: z.object({
		dao: z
			.enum(["COMPOUND", "UNISWAP", "ENS", "AAVE"])
			.describe("The DAO to fetch the proposal from"),
		proposalId: z
			.number()
			.describe("The proposal ID to fetch (must be positive)"),
	}),
	fn: async ({ dao, proposalId }, { state }) => {
		const daoConfig = SUPPORTED_DAOS[dao];
		console.log(
			`📋 Fetching proposal #${proposalId} from ${daoConfig.name} (${daoConfig.chain})...`,
		);

		try {
			const proposal = await getProposal(dao, proposalId);
			const votingStats = calculateVotingStats(proposal);

			// Store in state for other agents to access
			state.set(STATE_KEYS.PROPOSAL_DATA, proposal);
			state.set(STATE_KEYS.ANALYSIS_PROGRESS, {
				status: "proposal_fetched",
				dao,
				proposalId,
			});

			console.log(`✅ Successfully fetched proposal: ${proposal.title}`);

			return {
				success: true,
				proposal: {
					...proposal,
					chain: daoConfig.chain,
					votingStats,
					formattedForVotes: formatVotes(proposal.forVotes),
					formattedAgainstVotes: formatVotes(proposal.againstVotes),
					formattedAbstainVotes: formatVotes(proposal.abstainVotes),
					formattedQuorum: formatVotes(proposal.quorum),
				},
				message: `Successfully fetched proposal #${proposalId} from ${daoConfig.name} on ${daoConfig.chain}`,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			console.error(`❌ Failed to fetch proposal: ${errorMessage}`);

			return {
				success: false,
				error: errorMessage,
				message: `Failed to fetch proposal #${proposalId} from ${dao}: ${errorMessage}`,
			};
		}
	},
});

/**
 * Tool to list recent proposals from a DAO
 */
export const listProposalsTool = createTool({
	name: "list_proposals",
	description:
		"List recent proposals from a DAO's on-chain governance. Returns the latest proposals with their status and vote counts. Supports Ethereum mainnet DAOs.",
	schema: z.object({
		dao: z
			.enum(["COMPOUND", "UNISWAP", "ENS", "AAVE"])
			.describe("The DAO to list proposals from"),
		limit: z
			.number()
			.optional()
			.default(5)
			.describe("Number of recent proposals to fetch (1-10, default 5)"),
	}),
	fn: async ({ dao, limit }, { state }) => {
		const daoConfig = SUPPORTED_DAOS[dao];
		console.log(
			`📋 Listing last ${limit} proposals from ${daoConfig.name} (${daoConfig.chain})...`,
		);

		try {
			const proposals = await getRecentProposals(dao, limit);
			const count = await getProposalCount(dao);

			// Store in state
			state.set(STATE_KEYS.PROPOSAL_HISTORY, proposals);

			const proposalSummaries = proposals.map((p) => {
				const stats = calculateVotingStats(p);
				return {
					id: p.id,
					title: p.title.slice(0, 100),
					status: p.status,
					forVotes: formatVotes(p.forVotes),
					againstVotes: formatVotes(p.againstVotes),
					quorumReached: stats.quorumReached,
				};
			});

			console.log(`✅ Found ${proposals.length} proposals`);

			return {
				success: true,
				dao: daoConfig.name,
				chain: daoConfig.chain,
				totalProposals: count,
				proposals: proposalSummaries,
				message: `Found ${proposals.length} recent proposals from ${daoConfig.name} on ${daoConfig.chain} (${count} total)`,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			console.error(`❌ Failed to list proposals: ${errorMessage}`);

			return {
				success: false,
				error: errorMessage,
				message: `Failed to list proposals from ${dao}: ${errorMessage}`,
			};
		}
	},
});

/**
 * Tool to get supported DAOs information
 */
export const getSupportedDAOsTool = createTool({
	name: "get_supported_daos",
	description:
		"Get the list of supported DAOs and their governance contract addresses, including chain information",
	schema: z.object({}),
	fn: async () => {
		const daos = Object.entries(SUPPORTED_DAOS).map(([key, value]) => ({
			key,
			name: value.name,
			governor: value.governor,
			token: value.token || "N/A",
			chain: value.chain,
		}));

		return {
			success: true,
			daos,
			message: `${daos.length} DAOs are supported: ${daos.map((d) => `${d.name} (${d.chain})`).join(", ")}`,
		};
	},
});
