"use server";

import { getDraftGenerator } from "@/agents/draft-generator/agent";
import {
	type ArticlePreview,
	PLATFORM_SPECS,
	type Platform,
	type PlatformDraft,
	type PostFormat,
	type PreviewResult,
	THREAD_LENGTH_MAX,
	THREAD_LENGTH_MIN,
	type Tone,
} from "@/types";

// Singleton runner — avoid re-initializing on every call. The
// WebFetchCachePlugin is attached to this runner, so the URL cache
// survives across requests for the lifetime of the process.
let draftRunner: Awaited<ReturnType<typeof getDraftGenerator>> | null = null;

async function ensureDraftRunner() {
	if (!draftRunner) draftRunner = await getDraftGenerator();
	return draftRunner;
}

type DraftRunner = Awaited<ReturnType<typeof getDraftGenerator>>;

const TRANSIENT_PATTERNS =
	/\b503\b|UNAVAILABLE|overload|high demand|RESOURCE_EXHAUSTED|\b429\b|ECONNRESET|ETIMEDOUT|fetch failed/i;

/**
 * `runner.ask()` throws when the model returns an upstream error (e.g.
 * Gemini 503) because the raw error string fails schema validation.
 * Retry a handful of times on transient errors with exponential backoff
 * before surfacing the failure.
 */
async function askWithRetry(
	runner: DraftRunner,
	prompt: string,
	maxRetries = 2,
): Promise<unknown> {
	let lastError: unknown;
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await runner.ask(prompt);
		} catch (err) {
			lastError = err;
			const msg = err instanceof Error ? err.message : String(err);
			if (!TRANSIENT_PATTERNS.test(msg) || attempt === maxRetries) throw err;
			await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
		}
	}
	throw lastError;
}

/**
 * Map noisy agent/network errors to short user-facing messages.
 * Logs the raw error for debugging — only the cleaned message is thrown.
 */
function toUserMessage(error: unknown): string {
	console.error("[actions]", error);
	const raw = error instanceof Error ? error.message : String(error);

	if (/\b503\b|UNAVAILABLE|overload|high demand/i.test(raw)) {
		return "The model is overloaded right now. Try again in a few seconds.";
	}
	if (/RESOURCE_EXHAUSTED|\b429\b|rate.?limit|quota/i.test(raw)) {
		return "Rate-limited by the AI provider. Wait a moment and retry.";
	}
	if (
		/ENOTFOUND|ETIMEDOUT|ECONNREFUSED|ECONNRESET|fetch failed|getaddrinfo/i.test(
			raw,
		)
	) {
		return "Couldn't reach the article URL. Check the link and try again.";
	}
	if (/\b404\b/i.test(raw)) {
		return "Article not found at that URL.";
	}
	if (/paywall|login.?required/i.test(raw)) {
		return "This article is behind a login or paywall — can't read it.";
	}
	if (/ZodError|invalid_type|Invalid input|parse.*schema/i.test(raw)) {
		return "The model returned an unexpected response. Try again.";
	}
	return "Something went wrong generating drafts. Try again.";
}

// Only X and Threads can be threaded; LinkedIn is always a single post.
const isThreadable = (platform: Platform): boolean =>
	platform === "x" || platform === "threads";

const clampThreadLength = (n: number): number =>
	Math.min(THREAD_LENGTH_MAX, Math.max(THREAD_LENGTH_MIN, Math.round(n)));

function buildDraft(
	platform: Platform,
	content: string,
	hashtags: string[],
	segments: string[] | undefined,
	format: PostFormat,
): PlatformDraft {
	const spec = PLATFORM_SPECS[platform];
	const wantsThread = format === "thread" && isThreadable(platform);
	const hasSegments = Array.isArray(segments) && segments.length > 1;

	if (wantsThread && hasSegments && segments) {
		const joined = segments.join("\n\n");
		const maxLen = segments.reduce((m, s) => Math.max(m, s.length), 0);
		return {
			platform,
			content: joined,
			segments,
			hashtags,
			charLimit: spec.charLimit,
			charCount: maxLen,
		};
	}

	return {
		platform,
		content,
		hashtags,
		charLimit: spec.charLimit,
		charCount: content.length,
	};
}

function formatLabel(
	platform: Platform,
	format: PostFormat,
	threadLength: number,
): string {
	if (format === "thread" && isThreadable(platform)) {
		return `thread of ${threadLength} posts (each <=${PLATFORM_SPECS[platform].charLimit} chars)`;
	}
	return `single post (<=${PLATFORM_SPECS[platform].charLimit} chars)`;
}

function buildPlatformBrief(
	platforms: Platform[],
	format: PostFormat,
	threadLength: number,
): string {
	return platforms
		.map((p) => {
			const spec = PLATFORM_SPECS[p];
			return `- ${p} — ${spec.label} — format: ${formatLabel(p, format, threadLength)}`;
		})
		.join("\n");
}

type AgentOutput = {
	article: ArticlePreview;
	drafts: Array<{
		platform: Platform;
		content: string;
		segments?: string[];
		hashtags: string[];
	}>;
};

/**
 * Generate one draft per selected platform. The agent fetches the article
 * itself via its built-in `web_fetch` tool (cached by URL via
 * `WebFetchCachePlugin`).
 */
export async function previewPosts(params: {
	url: string;
	tone: Tone;
	platforms: Platform[];
	format: PostFormat;
	threadLength: number;
}): Promise<PreviewResult> {
	const { url, tone, platforms, format } = params;
	const threadLength = clampThreadLength(params.threadLength);
	if (platforms.length === 0) {
		throw new Error("Select at least one platform.");
	}

	try {
		const runner = await ensureDraftRunner();

		const prompt = `Generate one social media draft per requested platform for this article.

URL to fetch with web_fetch: ${url}

Tone: ${tone}

Requested platforms and formats:
${buildPlatformBrief(platforms, format, threadLength)}

Return exactly ${platforms.length} draft${platforms.length === 1 ? "" : "s"} — one per platform listed above. Do NOT exceed any platform's per-post char limit. For platforms in "thread" format, return a \`segments\` array with EXACTLY ${threadLength} posts.`;

		const result = (await askWithRetry(runner, prompt)) as AgentOutput;

		const selected = new Set(platforms);
		const drafts: PlatformDraft[] = result.drafts
			.filter((d) => selected.has(d.platform))
			.map((d) =>
				buildDraft(d.platform, d.content, d.hashtags, d.segments, format),
			);

		return { article: result.article, drafts };
	} catch (error) {
		throw new Error(toUserMessage(error));
	}
}

/**
 * Regenerate a single platform's draft. The URL cache hits on re-fetch,
 * so regenerate doesn't pay the article-download cost again.
 */
export async function regenerateDraft(params: {
	url: string;
	platform: Platform;
	tone: Tone;
	format: PostFormat;
	threadLength: number;
}): Promise<PlatformDraft> {
	const { url, platform, tone, format } = params;
	const threadLength = clampThreadLength(params.threadLength);

	try {
		const runner = await ensureDraftRunner();
		const spec = PLATFORM_SPECS[platform];

		const wantsThread = format === "thread" && isThreadable(platform);

		const prompt = `Use web_fetch to read this article, then generate exactly one draft for "${platform}".

URL: ${url}

Tone: ${tone}

Platform and format:
- ${platform} — ${spec.label} — format: ${formatLabel(platform, format, threadLength)}

Return JSON with the article block AND exactly one draft for "${platform}". Try a fresh angle or hook so this feels different from a typical first attempt. Do NOT exceed the per-post char limit. ${
			wantsThread
				? `Return a \`segments\` array with EXACTLY ${threadLength} posts.`
				: ""
		}`;

		const result = (await askWithRetry(runner, prompt)) as AgentOutput;

		const match = result.drafts.find((d) => d.platform === platform);
		if (!match) {
			throw new Error(`Agent did not return a draft for platform: ${platform}`);
		}

		return buildDraft(
			match.platform,
			match.content,
			match.hashtags,
			match.segments,
			format,
		);
	} catch (error) {
		throw new Error(toUserMessage(error));
	}
}
