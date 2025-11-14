# ATP Micropayment Agent – Payment Server

Local x402 payment server that demonstrates how to protect API endpoints with pay-per-call micropayments. Built with Hono and x402-hono middleware to proxy IQ AI's ATP API.

## Features

- **Payment Protection**: x402 middleware for all ATP endpoints
- **Transparent Pricing**: `/api/price-list` shows costs
- **IQAI ATP Proxy**: Direct access to agent data
- **Base Sepolia**: Built for Base network

## Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

1. Update `.env` with your payment details:

```env
FACILITATOR_URL="https://x402.org/facilitator"
ADDRESS=your_wallet_address_here # Wallet that receives x402 payments
NETWORK=base-sepolia
```

1. Install dependencies and start the server:

```bash
pnpm install
pnpm dev
```

Server runs on `http://localhost:3001`

## Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/api/price-list` | Free | Get endpoint pricing information |
| `/api/prices` | $0.01 | Get current token prices |
| `/api/holdings` | $0.05 | Get wallet holdings for IQ AI agents |
| `/api/agents/info` | $0.05 | Get agent metadata by contract address |
| `/api/agents/stats` | $0.05 | Get agent performance statistics |
| `/api/agents/top` | $0.10 | Get top agents by various metrics |
