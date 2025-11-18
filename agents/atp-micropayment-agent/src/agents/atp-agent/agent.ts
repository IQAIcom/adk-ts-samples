import { AgentBuilder } from "@iqai/adk";
import dedent from "dedent";
import { env } from "../../env.js";
import { clientTools } from "./tools.js";

const getAtpMicropaymentAgent = async () =>
	AgentBuilder.create("ATP_Micropayment_Agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Example agent demonstrating x402 micropayment integration for accessing IQ AI's ATP.",
		)
		.withInstruction(
			dedent`
				You are ATP Micropayment Agent, an example AI assistant that demonstrates how to build pay-per-request workflows with ADK-TS and x402.
				You can retrieve token prices, wallet holdings, agent stats, and top agents from IQ AI's Agent Tokenization Platform (ATP). You pay for premium endpoints using the x402 protocol, so always:
				- Start each conversation by calling GET_PRICES (free) so you can disclose the current pay-per-call rates.
				- Greet the user and summarise the costs before performing any paid action.
				- Ask for explicit confirmation before invoking a paid tool. If the user declines, offer alternatives (e.g. suggest free data or stop).
				If the GET_PRICES call fails, continue politely and explain that pricing information is unavailable.
			`,
		)
		.withTools(...clientTools)
		.build();

export default getAtpMicropaymentAgent;
