export type Platform = "linkedin" | "x" | "threads";

export type Tone =
	| "auto"
	| "professional"
	| "casual"
	| "educational"
	| "punchy";

/** X and Threads both support single posts or a chained thread. */
export type PostFormat = "post" | "thread";

/** Bounds and default for the number of posts in a thread. */
export const THREAD_LENGTH_MIN = 2;
export const THREAD_LENGTH_MAX = 10;
export const THREAD_LENGTH_DEFAULT = 4;

/** Platforms that can be posted as a chained thread. */
export const THREADABLE_PLATFORMS: Platform[] = ["x", "threads"];

export type PlatformSpec = {
	charLimit: number;
	label: string;
	description: string;
};

export const PLATFORM_SPECS: Record<Platform, PlatformSpec> = {
	linkedin: {
		charLimit: 3000,
		label: "LinkedIn",
		description: "An in-depth, professional post for LinkedIn.",
	},
	x: {
		charLimit: 280,
		label: "X (Twitter)",
		description: "A punchy, casual post for X.",
	},
	threads: {
		charLimit: 500,
		label: "Threads",
		description: "A conversational, community-friendly post for Threads.",
	},
};

export const PLATFORM_LABELS: Record<Platform, string> = {
	linkedin: "LinkedIn",
	x: "X (Twitter)",
	threads: "Threads",
};

/** Platforms the user can pick. Order is the display order. */
export const ALL_PLATFORMS: Platform[] = ["linkedin", "x", "threads"];

export type PlatformDraft = {
	platform: Platform;
	content: string;
	/** When set, this draft is a chained thread (X or Threads). `content` is the joined view. */
	segments?: string[];
	hashtags: string[];
	charLimit: number;
	/** For single posts: content length. For threads: longest segment length. */
	charCount: number;
};

export type ArticlePreview = {
	url: string;
	title: string;
};

export type PreviewResult = {
	article: ArticlePreview;
	drafts: PlatformDraft[];
};
