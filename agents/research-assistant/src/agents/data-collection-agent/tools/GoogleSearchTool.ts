import { GoogleSearch as BaseGoogleSearch, type ToolContext } from "@iqai/adk";

/**
 * Custom Google Search Tool that extends the base ADK GoogleSearch tool.
 *
 * This tool provides real Google search functionality when API keys are configured,
 * falling back to mock/dummy data when keys are missing (for demonstration purposes).
 *
 * Features:
 * - Uses Google's Custom Search API for real search results
 * - Requires GOOGLE_API_KEY and GOOGLE_CX environment variables
 * - Falls back to mock data if API keys are not configured
 * - Returns structured search results with titles, URLs, and snippets
 */
export class GoogleSearchTool extends BaseGoogleSearch {
  async runAsync(
    args: { query: string; num_results?: number },
    _context: ToolContext
  ) {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
    const GOOGLE_CX = process.env.GOOGLE_CX || "";

    // ✅ fallback to mock mode if keys are missing
    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      return super.runAsync(args, _context);
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
      args.query
    )}&num=${args.num_results ?? 1}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.text();
        return { error: `Google Search API error: ${err}` };
      }

      const data = (await res.json()) as { items?: any[] };
      const items = data.items || [];
      if (items.length === 0) return "No results found.";

      const formatted = items
        .map(
          (item: any, i: number) =>
            `Result ${i + 1}:\nTitle: ${item.title}\nURL: ${
              item.link
            }\nContent: ${item.snippet}`
        )
        .join("\n\n");

      return formatted;
    } catch (err: any) {
      return { error: `Search failed: ${err.message}` };
    }
  }
}
