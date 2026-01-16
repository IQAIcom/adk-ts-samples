import {
	type Address,
	createPublicClient,
	formatUnits,
	http,
	type PublicClient,
	parseAbiItem,
} from "viem";
import { mainnet } from "viem/chains";
import { PROPOSAL_STATES, SUPPORTED_DAOS } from "../constants";
import { env } from "../env";
import type { DAOConfig, ProposalData } from "../types";

/**
 * Service for fetching on-chain DAO governance data using viem
 * Supports Ethereum mainnet Governor Bravo contracts
 */

/**
 * Governor Bravo ABI for reading proposals
 */
const governorBravoAbi = [
	{
		name: "proposalCount",
		type: "function",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint256" }],
	},
	{
		name: "proposals",
		type: "function",
		stateMutability: "view",
		inputs: [{ name: "proposalId", type: "uint256" }],
		outputs: [
			{ name: "id", type: "uint256" },
			{ name: "proposer", type: "address" },
			{ name: "eta", type: "uint256" },
			{ name: "startBlock", type: "uint256" },
			{ name: "endBlock", type: "uint256" },
			{ name: "forVotes", type: "uint256" },
			{ name: "againstVotes", type: "uint256" },
			{ name: "abstainVotes", type: "uint256" },
			{ name: "canceled", type: "bool" },
			{ name: "executed", type: "bool" },
		],
	},
	{
		name: "state",
		type: "function",
		stateMutability: "view",
		inputs: [{ name: "proposalId", type: "uint256" }],
		outputs: [{ type: "uint8" }],
	},
	{
		name: "quorumVotes",
		type: "function",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint256" }],
	},
] as const;

/**
 * ProposalCreated event ABI for Governor Bravo
 */
const proposalCreatedEvent = parseAbiItem(
	"event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
);

/**
 * Create a viem public client for Ethereum mainnet
 */
function getClient(): PublicClient {
	return createPublicClient({
		chain: mainnet,
		transport: http(env.ETHEREUM_RPC_URL),
	});
}

/**
 * Fetches proposal creation event logs to get description.
 */
async function getProposalDescription(
	client: PublicClient,
	governorAddress: Address,
	proposalId: bigint,
): Promise<{
	description: string;
	targets: string[];
	values: string[];
	signatures: string[];
	calldatas: string[];
	voteStart: number;
	voteEnd: number;
	createdAt: string;
}> {
	try {
		const currentBlock = await client.getBlockNumber();
		const blockRange = 5000000n;
		const fromBlock =
			currentBlock > blockRange ? currentBlock - blockRange : 0n;

		const logs = await client.getLogs({
			address: governorAddress,
			event: proposalCreatedEvent,
			fromBlock,
			toBlock: "latest",
		});

		for (const log of logs) {
			if (log.args.id === proposalId) {
				// Get the block timestamp for the creation date
				let createdAt = new Date().toISOString();
				if (log.blockNumber) {
					try {
						const block = await client.getBlock({
							blockNumber: log.blockNumber,
						});
						createdAt = new Date(Number(block.timestamp) * 1000).toISOString();
					} catch (error) {
						console.error(
							`[governanceService] Failed to fetch description for proposal ${proposalId}:`,
							error,
						);
					}
				}

				return {
					description: log.args.description || `Proposal #${proposalId}`,
					targets: [...(log.args.targets || [])].map((t) => t.toString()),
					values: [...(log.args.values || [])].map((v) => v.toString()),
					signatures: [...(log.args.signatures || [])],
					calldatas: [...(log.args.calldatas || [])].map((c) => c.toString()),
					voteStart: Number(log.args.startBlock || 0),
					voteEnd: Number(log.args.endBlock || 0),
					createdAt,
				};
			}
		}
	} catch {
		// Silently fail
	}

	return {
		description: `Proposal #${proposalId}`,
		targets: [],
		values: [],
		signatures: [],
		calldatas: [],
		voteStart: 0,
		voteEnd: 0,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Fetches the proposal count for a DAO
 */
export async function getProposalCount(
	daoKey: keyof typeof SUPPORTED_DAOS,
): Promise<number> {
	const dao = SUPPORTED_DAOS[daoKey];
	const client = getClient();

	const count = await client.readContract({
		address: dao.governor as Address,
		abi: governorBravoAbi,
		functionName: "proposalCount",
	});

	return Number(count);
}

/**
 * Fetches a specific proposal by ID
 */
export async function getProposal(
	daoKey: keyof typeof SUPPORTED_DAOS,
	proposalId: number | bigint,
): Promise<ProposalData> {
	const dao = SUPPORTED_DAOS[daoKey];
	const client = getClient();
	const governorAddress = dao.governor as Address;

	const [proposalData, state, quorum] = await Promise.all([
		client.readContract({
			address: governorAddress,
			abi: governorBravoAbi,
			functionName: "proposals",
			args: [BigInt(proposalId)],
		}),
		client.readContract({
			address: governorAddress,
			abi: governorBravoAbi,
			functionName: "state",
			args: [BigInt(proposalId)],
		}),
		client.readContract({
			address: governorAddress,
			abi: governorBravoAbi,
			functionName: "quorumVotes",
		}),
	]);

	const [
		id,
		proposer,
		eta,
		startBlock,
		endBlock,
		forVotes,
		againstVotes,
		abstainVotes,
		canceled,
		executed,
	] = proposalData;

	const proposalDetails = await getProposalDescription(
		client,
		governorAddress,
		id,
	);

	const descriptionText = proposalDetails.description;
	const titleMatch = descriptionText.match(/^#\s*(.+?)(?:\n|$)/);
	const title = titleMatch ? titleMatch[1] : descriptionText.slice(0, 100);

	return {
		id: id.toString(),
		dao: dao.name,
		proposer,
		title,
		description: descriptionText,
		status: PROPOSAL_STATES[state] || "Unknown",
		forVotes: forVotes.toString(),
		againstVotes: againstVotes.toString(),
		abstainVotes: abstainVotes.toString(),
		quorum: quorum.toString(),
		startBlock: Number(startBlock),
		endBlock: Number(endBlock),
		eta: Number(eta),
		canceled,
		executed,
		targets: proposalDetails.targets,
		values: proposalDetails.values,
		signatures: proposalDetails.signatures,
		calldatas: proposalDetails.calldatas,
		createdAt: proposalDetails.createdAt,
	};
}

/**
 * Fetches recent proposals from a DAO
 */
export async function getRecentProposals(
	daoKey: keyof typeof SUPPORTED_DAOS,
	limit = 5,
): Promise<ProposalData[]> {
	const proposals: ProposalData[] = [];
	const count = await getProposalCount(daoKey);
	const startId = Math.max(1, count - limit + 1);

	for (let id = count; id >= startId; id--) {
		try {
			const proposal = await getProposal(daoKey, id);
			proposals.push(proposal);
		} catch (error) {
			console.error(`Failed to fetch proposal ${id}:`, error);
		}
	}

	return proposals;
}

/**
 * Gets the list of supported DAOs
 */
export function getSupportedDAOs(): DAOConfig[] {
	return Object.values(SUPPORTED_DAOS).map((dao) => ({
		...dao,
		chain: dao.chain,
	}));
}

/**
 * Formats vote counts for display (converts from wei to readable format)
 */
export function formatVotes(votes: string): string {
	const formatted = Number(formatUnits(BigInt(votes), 18));

	if (formatted >= 1_000_000) {
		return `${(formatted / 1_000_000).toFixed(2)}M`;
	} else if (formatted >= 1_000) {
		return `${(formatted / 1_000).toFixed(2)}K`;
	}
	return formatted.toFixed(2);
}

/**
 * Calculates voting statistics for a proposal
 */
export function calculateVotingStats(proposal: ProposalData): {
	totalVotes: string;
	forPercentage: string;
	againstPercentage: string;
	abstainPercentage: string;
	quorumReached: boolean;
	quorumPercentage: string;
} {
	const forVotes = BigInt(proposal.forVotes);
	const againstVotes = BigInt(proposal.againstVotes);
	const abstainVotes = BigInt(proposal.abstainVotes);
	const quorum = BigInt(proposal.quorum);

	const totalVotes = forVotes + againstVotes + abstainVotes;

	const forPct = totalVotes > 0n ? Number((forVotes * 100n) / totalVotes) : 0;
	const againstPct =
		totalVotes > 0n ? Number((againstVotes * 100n) / totalVotes) : 0;
	const abstainPct =
		totalVotes > 0n ? Number((abstainVotes * 100n) / totalVotes) : 0;

	const quorumReached = forVotes >= quorum;
	const quorumPct = quorum > 0n ? Number((forVotes * 100n) / quorum) : 0;

	return {
		totalVotes: formatVotes(totalVotes.toString()),
		forPercentage: `${forPct.toFixed(1)}%`,
		againstPercentage: `${againstPct.toFixed(1)}%`,
		abstainPercentage: `${abstainPct.toFixed(1)}%`,
		quorumReached,
		quorumPercentage: `${quorumPct.toFixed(1)}%`,
	};
}
