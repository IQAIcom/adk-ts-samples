import { AgentBuilder, type SamplingHandler } from "@iqai/adk";
import { env } from "@/env";
import { getTelegramTools } from "./tools";

export const createTelegramAgent = async (samplingHandler: SamplingHandler) => {
	const tools = await getTelegramTools(samplingHandler);

	return AgentBuilder.create("telegram_agent")
		.withModel(env.LLM_MODEL)
		.withTools(...tools)
		.build();
};
