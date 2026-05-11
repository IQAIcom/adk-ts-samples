import * as path from "node:path";
import { FileOperationsTool, HttpRequestTool, createTool } from "@iqai/adk";
import * as z from "zod";

// Gives the agent read access to markdown files in the knowledge-base directory (FAQs, policies, shipping info).
// In real life, this would point to a CMS, a database, or an internal knowledge management system (e.g. Notion, Confluence, or a vector store for semantic search).
export const knowledgeBaseTool = new FileOperationsTool({
	basePath: path.join(process.cwd(), "src", "server", "knowledge-base"),
});

// Allows the agent to make outbound HTTP requests to fetch live data such as order status or user account info.
// In real life, this would call your own authenticated backend APIs rather than a public mock API, and would include auth headers, error handling, and rate limiting.
export const httpRequestTool = new HttpRequestTool();

// Creates a support ticket and flags the session for human follow-up.
// In real life, this would open a ticket in a helpdesk system (e.g. Zendesk, Intercom, or Freshdesk), notify an agent via Slack or email, and store the conversation transcript.
export const escalateToHumanTool = createTool({
	name: "escalate_to_human",
	description:
		"Escalate this conversation to a human support agent. Use this when: the customer is frustrated, the issue cannot be resolved automatically, the customer explicitly requests a human, or you have failed to resolve the issue after 2 attempts.",
	schema: z.object({
		reason: z.string().describe("Why this conversation needs a human agent"),
		summary: z
			.string()
			.describe(
				"A concise summary of the conversation and the unresolved issue for the human agent",
			),
	}),
	fn: ({ reason, summary }, context) => {
		context.state.set("escalated", true);

		const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;
		const timestamp = new Date().toISOString();

		console.log("\n--- ESCALATION TICKET CREATED ---");
		console.log(`Ticket ID : ${ticketId}`);
		console.log(`Timestamp : ${timestamp}`);
		console.log(`Reason    : ${reason}`);
		console.log(`Summary   : ${summary}`);
		console.log("---------------------------------\n");

		return {
			escalated: true,
			ticketId,
			message:
				"I've created a support ticket and a human agent will follow up with you within 2 business hours. Your ticket ID is " +
				ticketId +
				". You'll receive an email confirmation shortly.",
		};
	},
});
