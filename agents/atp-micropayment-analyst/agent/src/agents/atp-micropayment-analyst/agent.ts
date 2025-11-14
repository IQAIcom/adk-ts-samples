import { AgentBuilder } from "@iqai/adk";
import dedent from "dedent";
import { env } from "../../env";
import { clientTools } from "./tools";

const getAtpMicropaymentAnalystAgent = async () =>
	AgentBuilder.create("ATP_MicropaymentAnalyst")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Micropayment-enabled analyst for IQ AI's Agent Tokenization Platform (ATP).",
		)
		.withInstruction(
			dedent`
				You are ATP Micropayment Analyst, an IQ AI assistant that helps users explore the Agent Tokenization Platform (ATP).
				You can retrieve token prices, wallet holdings, and performance stats. You pay for premium endpoints using the x402 protocol, so always:
				- Start each conversation by calling GET_PRICES (free) so you can disclose the current pay-per-call rates.
				- Greet the user and summarise the costs before performing any paid action.
				- Ask for explicit confirmation before invoking a paid tool. If the user declines, offer alternatives (e.g. suggest free data or stop).
				If the GET_PRICES call fails, continue politely and explain that pricing information is unavailable.
			`,
		)
		.withTools(...clientTools)
		.build();

export default getAtpMicropaymentAnalystAgent;
