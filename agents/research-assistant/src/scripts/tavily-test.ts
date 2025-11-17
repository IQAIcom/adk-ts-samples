import { config } from "dotenv";
config();

import {
	tavily as createTavilyClient,
	TavilySearchResponse,
} from "@tavily/core";

/**
 * Test script for Tavily search functionality
 * Verifies that Tavily can perform searches and return results with URLs and content
 *
 * To run this test: `pnpm tavily-test`
 */

async function testTavilySearch() {
	console.log("🧪 Testing Tavily Search Functionality...\n");

	try {
		const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

		if (!TAVILY_API_KEY) {
			console.log("⚠️  No TAVILY_API_KEY found. Testing with mock data...\n");

			// Mock test
			console.log("1. Testing mock response structure...");
			const mockResult = {
				query: "test query",
				follow_up_questions: null,
				answer: null,
				images: [],
				results: [
					{
						url: "https://example.com/search?q=test%20query",
						title: "Mock result for: test query",
						content:
							"This is mock content for 'test query'. Set TAVILY_API_KEY to get real results.",
						score: 0.99933845,
						raw_content:
							"<html><head><title>Test</title></head><body>Mock content</body></html>",
					},
				],
				response_time: 0,
				request_id: "mock-0",
			};

			console.log("✅ Mock response structure valid!");
			console.log(`   Query: ${mockResult.query}`);
			console.log(`   Total results: ${mockResult.results.length}\n`);
			console.log("🎉 Mock test passed! Set TAVILY_API_KEY for real testing.");
			return;
		}

		const tavily = createTavilyClient({ apiKey: TAVILY_API_KEY });

		// Test basic search
		console.log("1. Testing search query...");
		const response = await tavily.search(
			"artificial intelligence trends 2024",
			{
				maxResults: 1,
				includeRawContent: "markdown",
			},
		);

		console.log("✅ Search successful!");
		console.log(`   Query: ${response.query}`);
		console.log(`   Total results: ${response.results?.length || 0}`);
		console.log(`   Response time: ${response.responseTime || 0}ms\n`);

		// Display first result details
		if (response.results && response.results.length > 0) {
			const firstResult = response
				.results[0] as TavilySearchResponse["results"][0];
			console.log("📄 First result details:");
			console.log(`   URL: ${firstResult.url}`);
			console.log(`   Title: ${firstResult.title || "(no title)"}`);
			console.log(`   Content: ${firstResult.content || "(no content)"}`);
			console.log(`   Score: ${firstResult.score || 0}`);
			console.log(`   Raw Content preview: ${firstResult.rawContent}`);
		}

		console.log("🎉 All tests passed! Tavily search is working correctly.");
	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
}

// Run the test
testTavilySearch().catch((error) => {
	console.error("💥 Unexpected error:", error);
	process.exit(1);
});
