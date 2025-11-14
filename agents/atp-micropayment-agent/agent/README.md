# ATP Micropayment Agent

Example ADK-TS agent demonstrating x402 micropayment integration. Shows how to build agents that access paid APIs by disclosing pricing, requesting user approval, and automatically handling payments for premium endpoints like IQ AI's ATP data.

## Capabilities

- **x402 Micropayments**: Uses `x402-axios` + wallet private key to pay for premium ATP requests.
- **ATP Insights**: Fetches token prices, wallet holdings, agent metadata, stats, and leaderboards.
- **Transparent UX**: Always surfaces per-call pricing before paid requests and seeks confirmation.
- **Web Chat Interface**: Runs through `adk web` for an interactive experience.

## Setup

1. Copy the example environment file and fill in your keys:

```bash
cp .env.example .env
```

Set the required values:

```env
ADK_DEBUG=false
WALLET_PRIVATE_KEY=your_wallet_private_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

1. Install dependencies and start the agent:

```bash
pnpm install
pnpm dev
```

The `adk web` interface launches automatically.

## Available Tools

| Tool | Description | Pricing |
| --- | --- | --- |
| `GET_PRICES` | Fetch x402 endpoint price list so you can disclose costs. | Free |
| `GET_HOLDINGS` | Retrieve wallet holdings for a given address. | $0.05 |
| `GET_AGENT_INFO` | Pull metadata for a specific agent token. | $0.05 |
| `GET_AGENT_STATS` | View performance stats for a token contract. | $0.05 |
| `GET_TOP_AGENTS` | List top agents by market cap, holders, or inferences. | $0.10 |
