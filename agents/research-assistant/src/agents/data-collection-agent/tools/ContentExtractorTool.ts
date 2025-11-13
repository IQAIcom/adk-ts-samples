import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as cheerio from "cheerio";

/**
 * Fetches webpage HTML and extracts the readable text content.
 * @param args The arguments object containing the URL
 * @param args.url The URL of the webpage to extract content from
 * @returns The extracted readable text content from the webpage
 */
const extractContent = async (args: { url: string }) => {
  const { url } = args;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return `Error: Failed to fetch ${url} (${res.status})`;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $(
      "script, style, noscript, nav, header, footer, aside, .sidebar, .navigation, .menu, .nav, .footer, .header"
    ).remove();

    // Try to find main content in order of preference
    let content = "";

    // 1. Look for article tag
    if ($("article").length > 0) {
      content = $("article").first().text();
    }
    // 2. Look for main content divs with common classes/ids
    else if ($('[class*="content"]').length > 0) {
      content = $('[class*="content"]').first().text();
    } else if ($('[id*="content"]').length > 0) {
      content = $('[id*="content"]').first().text();
    } else if ($('[class*="article"]').length > 0) {
      content = $('[class*="article"]').first().text();
    } else if ($('[id*="article"]').length > 0) {
      content = $('[id*="article"]').first().text();
    } else if ($('[class*="main"]').length > 0) {
      content = $('[class*="main"]').first().text();
    } else if ($('[id*="main"]').length > 0) {
      content = $('[id*="main"]').first().text();
    }
    // 3. Fallback to body but try to exclude common non-content areas
    else {
      // Remove common non-content elements from body
      $("h1, h2, h3, h4, h5, h6")
        .filter((i, el) => {
          const text = $(el).text().toLowerCase();
          return (
            text.includes("skip to") ||
            text.includes("menu") ||
            text.includes("navigation")
          );
        })
        .remove();

      // Remove elements with very short text (likely navigation items)
      $("*")
        .filter((i, el) => $(el).text().trim().length < 10)
        .remove();

      content = $("body").text();
    }

    // Clean up the text
    const cleanedText = content
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    // Limit length for articles (1500-2000 words ≈ 8000-12000 characters)
    const extractedText = cleanedText.slice(0, 12000);

    return extractedText;
  } catch (err: any) {
    return `Error fetching ${url}: ${err.message}`;
  }
};

export const contentExtractorTool = createTool({
  name: "extract_content_tool",
  description: "Fetches webpage HTML and extracts the readable text content.",
  schema: z.object({
    url: z.string().url("Must be a valid URL"),
  }),
  fn: extractContent,
});
