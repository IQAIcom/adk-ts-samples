import type { CallbackContext } from "@iqai/adk";

/**
 * Pipeline progress tracking using before/after agent callbacks.
 *
 * These callbacks demonstrate the ADK-TS callback system by logging
 * when each pipeline step starts and completes, with execution timing.
 *
 * Callbacks receive a CallbackContext which provides access to:
 * - agentName: The name of the agent being executed
 * - state: The current session state (read/write)
 * - invocationId: Unique ID for this invocation
 *
 * Returning `undefined` allows normal execution to continue.
 * Returning a `Content` object would short-circuit the agent's execution.
 */

const STEP_LABELS: Record<string, string> = {
	researcher_agent: "Step 1/4: Researcher",
	analyst_agent: "Step 2/4: Analyst",
	recommender_agent: "Step 3/4: Recommender",
	writer_agent: "Step 4/4: Writer",
};

/**
 * Called before each agent in the pipeline starts executing.
 * Logs the step name and records the start time in session state.
 */
export const beforeAgentCallback = async (ctx: CallbackContext) => {
	const label = STEP_LABELS[ctx.agentName] ?? ctx.agentName;
	const startTime = Date.now();

	// Store start time in temp state for duration calculation
	ctx.state[`temp:${ctx.agentName}_start`] = startTime;

	console.log(`\n>> ${label} - Starting...`);

	return undefined; // Continue normal execution
};

/**
 * Called after each agent in the pipeline finishes executing.
 * Logs completion with execution duration.
 */
export const afterAgentCallback = async (ctx: CallbackContext) => {
	const label = STEP_LABELS[ctx.agentName] ?? ctx.agentName;
	const startTime = ctx.state[`temp:${ctx.agentName}_start`] as
		| number
		| undefined;
	const duration = startTime
		? ((Date.now() - startTime) / 1000).toFixed(1)
		: "?";

	console.log(`<< ${label} - Complete (${duration}s)`);

	return undefined; // Continue normal execution
};
