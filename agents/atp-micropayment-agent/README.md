# ATP Micropayment Agent

An example ADK-TS agent that demonstrates x402 micropayment integration for accessing premium APIs. This agent shows how to build AI assistants that transparently disclose costs, request user approval, and automatically handle payments for pay-per-request endpoints using IQ AI's Agent Tokenization Platform (ATP) as a real-world example.

## Features

💳 **x402 Micropayments**: Automatic payment handling using `x402-axios` interceptor with wallet integration

📈 **ATP Data Access**: Fetches token prices, wallet holdings, agent metadata, performance stats, and leaderboards

🔍 **Transparent Pricing**: Always discloses per-call costs before making paid requests

✅ **User Confirmation**: Seeks explicit approval before executing any paid operation

💡 **Smart Tool Selection**: Agent intelligently chooses the right ATP endpoint based on user queries

🚀 **Production-Ready**: Built with ADK-TS best practices and error handling

💬 **Web Chat Interface**: Interactive testing through `adk web` interface

⚡ **Base Sepolia Network**: Configured for Base testnet with easy mainnet migration

## Setup

1. Copy the example environment file and fill in your keys:

```bash
cp .env.example .env
```

Set the required values:

```env
WALLET_PRIVATE_KEY=your_wallet_private_key_here
GOOGLE_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash
API_SERVER_URL=http://localhost:3001
ADK_DEBUG=false
```

1. Install dependencies and start the agent:

```bash
pnpm install
pnpm dev
```

The `adk web` interface launches automatically at `https://adk-web.iqai.com`

## Available Tools

The agent has access to five ATP-powered tools:

| Tool | Description | Pricing |
| --- | --- | --- |
| `GET_PRICES` | Fetch x402 endpoint price list so you can disclose costs. | Free |
| `GET_HOLDINGS` | Retrieve wallet holdings for a given address. | $0.05 |
| `GET_AGENT_INFO` | Pull metadata for a specific agent token. | $0.05 |
| `GET_AGENT_STATS` | View performance stats for a token contract. | $0.05 |
| `GET_TOP_AGENTS` | List top agents by market cap, holders, or inferences. | $0.10 |
