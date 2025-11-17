# ATP Micropayment Agent – Payment Server

A local x402 payment server that demonstrates how to protect API endpoints with pay-per-call micropayments. Built with Hono and x402-hono middleware, this server acts as a payment proxy for IQ AI's Agent Tokenization Platform (ATP) API, enabling developers to monetize API access through the x402 micropayment protocol.

## Features

💳 **Payment Protection**: x402 middleware automatically validates payments for all ATP endpoints

💰 **Transparent Pricing**: Free `/api/price-list` endpoint displays all endpoint costs

🔗 **ATP API Proxy**: Seamless proxying to IQ AI's Agent Tokenization Platform

⚡ **Base Sepolia Network**: Built for Base testnet with production-ready architecture

🛡️ **Secure Payments**: Facilitator-based payment verification with wallet address configuration

🚀 **Lightweight & Fast**: Hono framework for minimal overhead and high performance

## Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

1. Update `.env` with your payment details:

```env
FACILITATOR_URL="https://x402.org/facilitator"
ADDRESS=your_wallet_address_here
NETWORK=base-sepolia
IQ_API_BASE_URL=https://app.iqai.com/api
```

1. Install dependencies and start the server:

```bash
pnpm install
pnpm dev
```

Server runs on `http://localhost:3001`

## Available Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/api/price-list` | Free | Get endpoint pricing information |
| `/api/prices` | $0.01 | Get current token prices |
| `/api/holdings` | $0.05 | Get wallet holdings for IQ AI agents |
| `/api/agents/info` | $0.05 | Get agent metadata by contract address |
| `/api/agents/stats` | $0.05 | Get agent performance statistics |
| `/api/agents/top` | $0.10 | Get top agents by various metrics |
