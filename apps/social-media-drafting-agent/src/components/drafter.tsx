"use client";

import {
	AlertCircle,
	ClipboardCheck,
	ClipboardCopy,
	Clock,
	Linkedin,
	Loader2,
	MessageCircle,
	RefreshCw,
	Trash2,
	Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	ALL_PLATFORMS,
	PLATFORM_LABELS,
	PLATFORM_SPECS,
	type Platform,
	type PlatformDraft,
	type PostFormat,
	type PreviewResult,
	THREAD_LENGTH_DEFAULT,
	THREAD_LENGTH_MAX,
	THREAD_LENGTH_MIN,
	THREADABLE_PLATFORMS,
	type Tone,
} from "@/types";
import { previewPosts, regenerateDraft } from "@/app/actions";

// ───────────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────────

const TONES: { value: Tone; label: string; description: string }[] = [
	{ value: "auto", label: "Auto", description: "Platform-appropriate" },
	{ value: "professional", label: "Professional", description: "Polished" },
	{ value: "casual", label: "Casual", description: "Friendly" },
	{ value: "educational", label: "Educational", description: "Explanatory" },
	{ value: "punchy", label: "Punchy", description: "Bold, short" },
];

const PLATFORM_ICONS: Record<Platform, typeof Linkedin> = {
	linkedin: Linkedin,
	x: Twitter,
	threads: MessageCircle,
};

// ───────────────────────────────────────────────────────────────────
// Local history (localStorage)
// ───────────────────────────────────────────────────────────────────

const HISTORY_KEY = "sma:history";
const MAX_HISTORY = 10;

type HistoryEntry = {
	id: string;
	url: string;
	tone: Tone;
	platforms: Platform[];
	format: PostFormat;
	threadLength: number;
	preview: PreviewResult;
	timestamp: number;
};

const loadHistory = (): HistoryEntry[] => {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(HISTORY_KEY);
		return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
	} catch {
		return [];
	}
};

const saveHistory = (items: HistoryEntry[]) => {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
	} catch {
		// ignore quota errors
	}
};

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

const withUrl = (content: string, url: string): string => {
	if (!url || content.includes(url)) return content;
	return `${content}\n\n${url}`;
};

const buildDraftCopy = (draft: PlatformDraft, url: string): string => {
	if (draft.segments && draft.segments.length > 1) {
		const n = draft.segments.length;
		return draft.segments
			.map((s, i) => {
				const body = i === n - 1 ? withUrl(s, url) : s;
				return `(${i + 1}/${n})\n${body}`;
			})
			.join("\n\n---\n\n");
	}
	return withUrl(draft.content, url);
};

const buildCopyAll = (drafts: PlatformDraft[], url: string): string =>
	drafts
		.map((d) => {
			const label = PLATFORM_LABELS[d.platform];
			return `### ${label}\n\n${buildDraftCopy(d, url)}\n`;
		})
		.join("\n---\n\n");

const timeAgo = (ts: number) => {
	const diff = Date.now() - ts;
	const mins = Math.round(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.round(hrs / 24)}d ago`;
};

// ───────────────────────────────────────────────────────────────────
// Shared class fragments (editorial)
// ───────────────────────────────────────────────────────────────────

const LABEL =
	"text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium";
const HAIRLINE = "border-t border-rule";
const CHIP_BASE =
	"inline-flex items-center gap-2 px-3 py-1.5 text-[12px] border transition-colors";
const CHIP_ON = "border-ink bg-ink text-paper";
const CHIP_OFF = "border-rule-strong bg-transparent text-ink hover:bg-paper-2";
const TEXTAREA =
	"w-full bg-transparent px-0 py-2 text-[15px] leading-relaxed text-ink placeholder:text-ink-soft focus:outline-none resize-none";
const INPUT =
	"w-full bg-transparent border-0 border-b border-ink px-0 py-2 text-base font-display focus:outline-none focus:border-accent placeholder:text-ink-soft";
const LINK_BTN =
	"inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-ink hover:text-accent underline underline-offset-4 decoration-rule-strong hover:decoration-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

export const Drafter = () => {
	// Form state
	const [url, setUrl] = useState("");
	const [tone, setTone] = useState<Tone>("auto");
	const [platforms, setPlatforms] = useState<Platform[]>([
		"linkedin",
		"x",
		"threads",
	]);
	const [format, setFormat] = useState<PostFormat>("post");
	const [threadLength, setThreadLength] = useState<number>(
		THREAD_LENGTH_DEFAULT,
	);

	// Generation state
	const [isGenerating, setIsGenerating] = useState(false);
	const [preview, setPreview] = useState<PreviewResult | null>(null);
	const [editableDrafts, setEditableDrafts] = useState<PlatformDraft[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Per-draft UI state
	const [regenerating, setRegenerating] = useState<Record<Platform, boolean>>({
		linkedin: false,
		x: false,
		threads: false,
	});
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	// History
	const [history, setHistory] = useState<HistoryEntry[]>([]);

	useEffect(() => {
		setHistory(loadHistory());
	}, []);

	useEffect(() => {
		saveHistory(history);
	}, [history]);

	useEffect(() => {
		if (!preview) return;
		const existing = history.find((h) => h.url === preview.article.url);
		const entry: HistoryEntry = {
			id: existing?.id ?? crypto.randomUUID(),
			url: preview.article.url,
			tone,
			platforms,
			format,
			threadLength,
			preview,
			timestamp: Date.now(),
		};
		setHistory((current) => {
			const without = current.filter((h) => h.url !== entry.url);
			return [entry, ...without].slice(0, MAX_HISTORY);
		});
	}, [preview, tone, platforms, format, threadLength, history]);

	const togglePlatform = (p: Platform) => {
		setPlatforms((cur) =>
			cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p],
		);
	};

	const resetResults = () => {
		setPreview(null);
		setEditableDrafts([]);
		setError(null);
	};

	const handleGenerate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!url.trim() || platforms.length === 0) return;

		resetResults();
		setIsGenerating(true);

		try {
			const result = await previewPosts({
				url,
				tone,
				platforms,
				format,
				threadLength,
			});
			setPreview(result);
			setEditableDrafts(result.drafts);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setError(`Failed to generate drafts: ${message}`);
		} finally {
			setIsGenerating(false);
		}
	};

	const updateDraftContent = (platform: Platform, content: string) => {
		setEditableDrafts((cur) =>
			cur.map((d) =>
				d.platform === platform
					? { ...d, content, charCount: content.length }
					: d,
			),
		);
	};

	const updateThreadSegment = (
		platform: Platform,
		index: number,
		value: string,
	) => {
		setEditableDrafts((cur) =>
			cur.map((d) => {
				if (d.platform !== platform || !d.segments) return d;
				const segments = d.segments.map((s, i) => (i === index ? value : s));
				const content = segments.join("\n\n");
				const charCount = segments.reduce((m, s) => Math.max(m, s.length), 0);
				return { ...d, segments, content, charCount };
			}),
		);
	};

	const handleRegenerate = async (draft: PlatformDraft) => {
		if (!preview) return;
		setRegenerating((r) => ({ ...r, [draft.platform]: true }));
		setError(null);
		try {
			const fresh = await regenerateDraft({
				url: preview.article.url,
				platform: draft.platform,
				tone,
				format,
				threadLength,
			});
			setEditableDrafts((cur) =>
				cur.map((d) => (d.platform === draft.platform ? fresh : d)),
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setError(`Regenerate failed: ${message}`);
		} finally {
			setRegenerating((r) => ({ ...r, [draft.platform]: false }));
		}
	};

	const handleCopy = async (key: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedKey(key);
			setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
		} catch {
			setError("Clipboard access denied by browser");
		}
	};

	const loadFromHistory = (entry: HistoryEntry) => {
		setUrl(entry.url);
		setTone(entry.tone);
		setPlatforms(entry.platforms);
		setFormat(entry.format ?? "post");
		setThreadLength(entry.threadLength ?? THREAD_LENGTH_DEFAULT);
		setPreview(entry.preview);
		setEditableDrafts(entry.preview.drafts);
		setError(null);
	};

	const removeFromHistory = (id: string) => {
		setHistory((cur) => cur.filter((h) => h.id !== id));
	};

	const clearAll = () => {
		setUrl("");
		resetResults();
	};

	const hasThreadable = platforms.some((p) => THREADABLE_PLATFORMS.includes(p));

	return (
		<div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-14">
			<div className="space-y-12 min-w-0">
				{/* Form */}
				<form onSubmit={handleGenerate} className="space-y-5">
					<div className="flex items-end gap-3">
						<div className="flex-1 min-w-0">
							<label htmlFor="url" className={`${LABEL} block mb-2`}>
								Blog URL
							</label>
							<input
								id="url"
								type="url"
								required
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="https://your-blog.com/post-slug"
								className={INPUT}
								disabled={isGenerating}
							/>
						</div>
						<button
							type="submit"
							disabled={isGenerating || !url.trim() || platforms.length === 0}
							className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper font-display tracking-tight hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{isGenerating ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span className="italic">Reading…</span>
								</>
							) : (
								<>
									<span>Draft</span>
									<span aria-hidden="true">→</span>
								</>
							)}
						</button>
					</div>

					<div className="flex flex-col items-start gap-x-5 gap-y-3">
						<div className="flex items-center gap-2 flex-wrap">
							<span className={LABEL}>Voice</span>
							{TONES.map((t) => {
								const on = tone === t.value;
								return (
									<button
										key={t.value}
										type="button"
										onClick={() => setTone(t.value)}
										disabled={isGenerating}
										title={t.description}
										className={`${CHIP_BASE} ${on ? CHIP_ON : CHIP_OFF}`}
									>
										<span className="font-display italic">{t.label}</span>
									</button>
								);
							})}
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							<span className={LABEL}>For</span>
							{ALL_PLATFORMS.map((p) => {
								const Icon = PLATFORM_ICONS[p];
								const on = platforms.includes(p);
								return (
									<button
										key={p}
										type="button"
										onClick={() => togglePlatform(p)}
										disabled={isGenerating}
										className={`${CHIP_BASE} ${on ? CHIP_ON : CHIP_OFF}`}
									>
										<Icon className="w-3.5 h-3.5" />
										<span>{PLATFORM_LABELS[p]}</span>
									</button>
								);
							})}
						</div>

						{hasThreadable && (
							<div className="flex items-center gap-2 flex-wrap">
								<span className={LABEL}>As</span>
								{(["post", "thread"] as PostFormat[]).map((f) => {
									const on = format === f;
									return (
										<button
											key={f}
											type="button"
											onClick={() => setFormat(f)}
											disabled={isGenerating}
											className={`${CHIP_BASE} ${on ? CHIP_ON : CHIP_OFF}`}
										>
											<span className="font-display italic">
												{f === "post" ? "Post" : "Thread"}
											</span>
										</button>
									);
								})}
								{format === "thread" && (
									<div className="inline-flex items-center border border-rule-strong">
										<button
											type="button"
											onClick={() =>
												setThreadLength((n) =>
													Math.max(THREAD_LENGTH_MIN, n - 1),
												)
											}
											disabled={
												isGenerating || threadLength <= THREAD_LENGTH_MIN
											}
											className="w-7 h-7 hover:bg-paper-2 disabled:opacity-30 border-r border-rule-strong text-sm"
											aria-label="Decrease thread length"
										>
											−
										</button>
										<span className="w-8 text-center font-display tabular-nums text-sm">
											{threadLength}
										</span>
										<button
											type="button"
											onClick={() =>
												setThreadLength((n) =>
													Math.min(THREAD_LENGTH_MAX, n + 1),
												)
											}
											disabled={
												isGenerating || threadLength >= THREAD_LENGTH_MAX
											}
											className="w-7 h-7 hover:bg-paper-2 disabled:opacity-30 border-l border-rule-strong text-sm"
											aria-label="Increase thread length"
										>
											+
										</button>
									</div>
								)}
							</div>
						)}
					</div>

					{error && (
						<div className="flex items-start gap-2 text-sm text-accent border-l-2 border-accent pl-3 py-1">
							<AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
							<span className="italic">{error}</span>
						</div>
					)}
				</form>

				{/* Drafts */}
				{preview && (
					<section>
						<div className="flex items-baseline justify-between gap-4 mb-1 flex-wrap border-t border-rule pt-6">
							<p className="font-display text-lg italic leading-snug min-w-0 flex-1 truncate">
								{preview.article.title || preview.article.url}
							</p>
							<div className="flex items-center gap-5 shrink-0">
								<button
									type="button"
									onClick={() =>
										handleCopy(
											"all",
											buildCopyAll(editableDrafts, preview.article.url),
										)
									}
									className={LINK_BTN}
								>
									{copiedKey === "all" ? (
										<>
											<ClipboardCheck className="w-3.5 h-3.5" />
											Copied
										</>
									) : (
										<>
											<ClipboardCopy className="w-3.5 h-3.5" />
											Copy all
										</>
									)}
								</button>
								<button type="button" onClick={clearAll} className={LINK_BTN}>
									New article
								</button>
							</div>
						</div>

						<div className="space-y-0">
							{editableDrafts.map((draft) => {
								const spec = PLATFORM_SPECS[draft.platform];
								const Icon = PLATFORM_ICONS[draft.platform];
								const over = draft.charCount > draft.charLimit;
								const copyKey = `draft-${draft.platform}`;
								const isThread = draft.segments && draft.segments.length > 1;
								return (
									<article
										key={draft.platform}
										className="py-8 border-t border-rule"
									>
										<header className="mb-4 flex items-baseline justify-between gap-3 flex-wrap">
											<div className="flex items-baseline gap-3">
												<Icon className="w-4 h-4 self-center" />
												<h3 className="font-display text-xl tracking-tight">
													{spec.label}
												</h3>
												<span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted italic">
													{isThread
														? `thread · ${draft.segments?.length} posts`
														: "post"}
												</span>
											</div>
											<span
												className={`font-mono text-xs ${over ? "text-accent" : "text-ink-muted"}`}
											>
												{draft.charCount} / {draft.charLimit}
											</span>
										</header>

										{/* body */}
										{isThread ? (
											<ol className="space-y-5">
												{draft.segments?.map((segment, i) => {
													const segOver = segment.length > draft.charLimit;
													return (
														<li
															key={`${draft.platform}-seg-${i}`}
															className="pl-9 relative"
														>
															<span
																className="absolute left-0 top-0 font-display italic text-accent text-lg leading-none"
																aria-hidden="true"
															>
																{i + 1}
															</span>
															<div className="flex items-center justify-between mb-1">
																<span className={LABEL}>
																	{i + 1} of {draft.segments?.length}
																</span>
																<span
																	className={`font-mono text-[11px] ${
																		segOver ? "text-accent" : "text-ink-muted"
																	}`}
																>
																	{segment.length} / {draft.charLimit}
																</span>
															</div>
															<textarea
																value={segment}
																onChange={(e) =>
																	updateThreadSegment(
																		draft.platform,
																		i,
																		e.target.value,
																	)
																}
																rows={3}
																className={`${TEXTAREA} border-b border-rule focus:border-ink`}
															/>
														</li>
													);
												})}
											</ol>
										) : (
											<textarea
												value={draft.content}
												onChange={(e) =>
													updateDraftContent(draft.platform, e.target.value)
												}
												rows={draft.platform === "linkedin" ? 10 : 5}
												className={`${TEXTAREA} border-b border-rule focus:border-ink`}
											/>
										)}

										{draft.hashtags.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 italic text-ink-muted text-sm">
												{draft.hashtags.map((h) => (
													<span key={h}>#{h.replace(/^#/, "")}</span>
												))}
											</div>
										)}

										<div className="mt-5 flex items-center gap-6">
											<button
												type="button"
												onClick={() =>
													handleCopy(
														copyKey,
														buildDraftCopy(draft, preview.article.url),
													)
												}
												className={LINK_BTN}
											>
												{copiedKey === copyKey ? (
													<>
														<ClipboardCheck className="w-3.5 h-3.5" />
														Copied
													</>
												) : (
													<>
														<ClipboardCopy className="w-3.5 h-3.5" />
														Copy
													</>
												)}
											</button>
											<button
												type="button"
												onClick={() => handleRegenerate(draft)}
												disabled={regenerating[draft.platform]}
												className={LINK_BTN}
											>
												{regenerating[draft.platform] ? (
													<>
														<Loader2 className="w-3.5 h-3.5 animate-spin" />
														Rewriting…
													</>
												) : (
													<>
														<RefreshCw className="w-3.5 h-3.5" />
														Rewrite
													</>
												)}
											</button>
										</div>
									</article>
								);
							})}
							<div className={HAIRLINE} />
						</div>
					</section>
				)}
			</div>

			<aside className="mt-14 lg:mt-0 lg:sticky lg:top-24 lg:self-start border-t lg:border-t-0 lg:border-l border-rule lg:pl-6 pt-5 lg:pt-0">
				<div className={`${LABEL} mb-4`}>Archive</div>
				{history.length === 0 ? (
					<p className="italic text-ink-muted text-sm leading-relaxed">
						Your recent articles will appear here.
					</p>
				) : (
					<ul className="space-y-4">
						{history.map((h) => (
							<li
								key={h.id}
								className="group/item border-t border-rule pt-3 flex items-start justify-between gap-2"
							>
								<button
									type="button"
									onClick={() => loadFromHistory(h)}
									className="text-left flex-1 min-w-0"
								>
									<div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-muted mb-1">
										<Clock className="w-2.5 h-2.5" />
										{timeAgo(h.timestamp)}
									</div>
									<p className="font-display italic text-sm leading-snug line-clamp-3 group-hover/item:text-accent transition-colors">
										{h.preview.article.title || h.url}
									</p>
								</button>
								<button
									type="button"
									onClick={() => removeFromHistory(h.id)}
									className="opacity-0 group-hover/item:opacity-100 text-ink-muted hover:text-accent transition-opacity shrink-0 mt-1"
									aria-label="Remove from archive"
									title="Remove"
								>
									<Trash2 className="w-3 h-3" />
								</button>
							</li>
						))}
					</ul>
				)}
			</aside>
		</div>
	);
};
