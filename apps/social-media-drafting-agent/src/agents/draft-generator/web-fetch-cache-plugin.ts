import type { BaseTool, ToolContext } from "@iqai/adk";
import { BasePlugin } from "@iqai/adk";

/**
 * Caches results from the ADK-TS `WebFetchTool` by URL with a TTL.
 *
 * Hooks into the ADK-TS plugin lifecycle:
 * - `beforeToolCallback` — if the URL is in cache and fresh, returns the
 *   cached result, which short-circuits the tool call. The agent proceeds as
 *   if the fetch happened (it just did, earlier).
 * - `afterToolCallback` — stores successful fresh results for next time.
 *
 * This means `regenerateDraft` doesn't re-fetch the same article, while the
 * agent code remains unchanged — the plugin is transparent.
 */
export class WebFetchCachePlugin extends BasePlugin {
	private cache = new Map<string, { result: unknown; expiresAt: number }>();
	private readonly ttlMs: number;

	constructor(ttlMs: number = 60 * 60 * 1000) {
		super("web-fetch-cache");
		this.ttlMs = ttlMs;
	}

	private keyFor(args: Record<string, unknown>): string | null {
		const url = args.url;
		return typeof url === "string" ? url : null;
	}

	async beforeToolCallback(params: {
		tool: BaseTool;
		toolArgs: Record<string, unknown>;
		toolContext: ToolContext;
	}): Promise<Record<string, unknown> | undefined> {
		if (params.tool.name !== "web_fetch") return undefined;

		const key = this.keyFor(params.toolArgs);
		if (!key) return undefined;

		const hit = this.cache.get(key);
		if (hit && Date.now() < hit.expiresAt) {
			// Short-circuit: the agent receives the cached result as if it just fetched.
			return hit.result as Record<string, unknown>;
		}

		return undefined; // allow the tool to run normally
	}

	async afterToolCallback(params: {
		tool: BaseTool;
		toolArgs: Record<string, unknown>;
		toolContext: ToolContext;
		result: Record<string, unknown>;
	}): Promise<Record<string, unknown> | undefined> {
		if (params.tool.name !== "web_fetch") return undefined;

		const key = this.keyFor(params.toolArgs);
		if (!key) return undefined;

		// Only cache successful results
		if ((params.result as { success?: boolean }).success !== false) {
			this.cache.set(key, {
				result: params.result,
				expiresAt: Date.now() + this.ttlMs,
			});
		}

		return undefined; // don't modify the fresh result
	}
}
