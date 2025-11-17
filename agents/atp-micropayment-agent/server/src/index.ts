import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { type Network, paymentMiddleware, type Resource } from "x402-hono";

config();

// Configuration from environment variables
const facilitatorUrl =
  (process.env.FACILITATOR_URL as Resource) || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS as `0x${string}`;
const network = (process.env.NETWORK as Network) || "base-sepolia";

if (!payTo) {
  console.error("❌ Please set your wallet ADDRESS in the .env file");
  process.exit(1);
}

const app = new Hono();

// Define paid routes and prices in one place so we can expose them
const PAID_ROUTES: Record<string, { price: string; network: Network }> = {
  "/api/prices": { price: "$0.01", network },
  "/api/holdings": { price: "$0.05", network },
  "/api/agents/info": { price: "$0.05", network },
  "/api/agents/stats": { price: "$0.05", network },
  "/api/agents/top": { price: "$0.10", network },
};

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);

app.use(
  paymentMiddleware(payTo, PAID_ROUTES, {
    url: facilitatorUrl,
  })
);

// Free endpoint to let clients know the x402 prices for paid endpoints
app.get("/api/price-list", c => {
  return c.json({ prices: PAID_ROUTES });
});

const IQ_API_BASE = "https://app.iqai.com/api";

/**
 * Factory function to create a proxy handler for upstream API endpoints
 * Reduces boilerplate by handling common patterns: URL construction, query params, error handling
 */
function createProxyHandler(
  endpoint: string,
  errorMessage: string,
  options?: {
    requiredParams?: string[];
    queryParams?: string[];
  }
) {
  return async (c: any) => {
    // Validate required query parameters
    if (options?.requiredParams) {
      for (const param of options.requiredParams) {
        if (!c.req.query(param)) {
          return c.json({ error: `${param} is required` }, 400);
        }
      }
    }

    try {
      const url = new URL(`${IQ_API_BASE}${endpoint}`);

      // Add query parameters to the URL
      if (options?.queryParams) {
        for (const param of options.queryParams) {
          const value = c.req.query(param);
          if (value) {
            url.searchParams.set(param, value);
          }
        }
      }

      const res = await fetch(url);
      if (!res.ok) return c.json({ error: "Upstream error" }, 502);

      const text = await res.text();
      return c.body(text, 200, { "Content-Type": "application/json" });
    } catch {
      return c.json({ error: errorMessage }, 502);
    }
  };
}

// Register proxy routes using the handler factory
app.get("/api/prices", createProxyHandler("/prices", "Failed to fetch prices"));

app.get(
  "/api/holdings",
  createProxyHandler("/holdings", "Failed to fetch holdings", {
    requiredParams: ["address"],
    queryParams: ["address"],
  })
);

app.get(
  "/api/agents/info",
  createProxyHandler("/agents/info", "Failed to fetch agent info", {
    requiredParams: ["address"],
    queryParams: ["address"],
  })
);

app.get(
  "/api/agents/stats",
  createProxyHandler("/agents/stats", "Failed to fetch agent stats", {
    requiredParams: ["address"],
    queryParams: ["address"],
  })
);

app.get(
  "/api/agents/top",
  createProxyHandler("/agents/top", "Failed to fetch top agents", {
    queryParams: ["sort", "limit"],
  })
);

console.log(`
🚀 Server up and running!!
`);

serve({
  fetch: app.fetch,
  port: 3001,
});
