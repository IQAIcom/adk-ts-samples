<div align="center">
  <img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="100" />
  <br/>
 <h1>ATP Micropayment Agent</h1>
 <b>Example agent demonstrating how to build monetized, pay-per-request AI workflows with ADK-TS and x402</b>
  <br/>
  <i>LLM-powered • x402 Micropayments • IQ AI ATP Integration • TypeScript</i>
</div>

---

# ATP Micropayment Agent – Building Monetized AI Workflows

Example project showing how to build agents that access paid API endpoints using the x402 micropayment protocol. This sample demonstrates the complete pattern: an ADK-TS agent with payment-enabled tools, a local x402 server that proxies premium endpoints, and user-friendly pricing disclosure. Developers can use this as a foundation for building their own monetized AI services.

**Built with [ADK-TS](https://adk.iqai.com/) - Agent Development Kit (ADK) for TypeScript**

## 🎯 What You’ll Learn

- **Micropayment-enabled tooling**: Use x402 to protect ATP endpoints and settle charges transparently.
- **Responsible UX patterns**: Present pricing, request approval, and fall back gracefully when the user declines.
- **Full-stack sample**: Pair an ADK-TS agent with a Hono-powered payment server that proxies IQ AI’s ATP API.
- **Extensible architecture**: Add new paid endpoints or tools with minimal changes.

## 🏗️ How It Works

```text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   ADK-TS Agent  │    │ x402 Payment API │    │   IQ AI ATP API     │
│                 │    │ (Hono Proxy)     │    │                     │
│ • Wallet Client │───▶│ • Payment Gates  │───▶│ • Premium Endpoints │
│ • Premium Tools │    │ • Price Config   │    │ • Agent Analytics   │
│ • Auto Payment  │    │ • Usage Logging  │    │ • Market Data       │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/)
- Google AI API key (Gemini) for LLM access
- Base Sepolia wallet funded with test ETH and, optionally, test USDC
- Basic understanding of x402 payment flows

### 1. Install dependencies

```bash
pnpm install
```

### 1. Configure environment variables

Create env files for both the payment server and the agent:

```bash
cd server && cp .env.example .env && cd ..
cd agent && cp .env.example .env && cd ..
```

Fill in the required values:

```env
# server/.env
FACILITATOR_URL="https://x402.org/facilitator"
ADDRESS=your_wallet_address_here
NETWORK=base-sepolia

# agent/.env
ADK_DEBUG=false
WALLET_PRIVATE_KEY=your_wallet_private_key_here
GOOGLE_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash
```

### 1. Start both services

```bash
pnpm dev
```

The script launches:

- `server/` on `http://localhost:3001` (x402 payment proxy)
- `agent/` via `adk web` for a browser-based chat interface

## 🧪 Testing Your Template

### Check Server Status

```bash
# Check if your server is running and view available endpoints
curl http://localhost:3001/api/price-list
```

Expected response showing endpoint prices:

```json
{
  "prices": {
    "/api/prices": { "price": "$0.01", "network": "base-sepolia" },
    "/api/holdings": { "price": "$0.05", "network": "base-sepolia" },
    "/api/agents/info": { "price": "$0.05", "network": "base-sepolia" },
    "/api/agents/stats": { "price": "$0.05", "network": "base-sepolia" },
    "/api/agents/top": { "price": "$0.10", "network": "base-sepolia" }
  }
}
```

### Interact with the agent

1. Open `https://adk-web.iqai.com` in your browser.
1. Start a chat; the agent displays pricing pulled from `GET_PRICES`.
1. Approve or decline paid actions as the agent surfaces data requests (e.g., “Get top agents by market cap?”).

Behind the scenes the wallet executes x402 micropayments, then the proxy returns ATP data to the agent.

## 🛠️ Development and Testing

### Test Components Separately

To test just the server or agent individually:

```bash
# Test just the server
cd server && pnpm dev

# Test just the agent (in another terminal)
cd agent && pnpm dev

# Test agent without web interface
cd agent && npx @iqai/adk-cli run
```

### Payment Server Details

- **Base URL**: `http://localhost:3001`
- **Network**: Base Sepolia (configurable)
- **Payment Protocol**: x402
- **Facilitator**: `https://x402.org/facilitator`

### Available Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/api/price-list` | Free | Get endpoint pricing information |
| `/api/prices` | $0.01 | Get current token prices |
| `/api/holdings` | $0.05 | Get wallet holdings for IQ AI agents |
| `/api/agents/info` | $0.05 | Get agent metadata by contract address |
| `/api/agents/stats` | $0.05 | Get agent performance statistics |
| `/api/agents/top` | $0.10 | Get top agents by various metrics |

## 📁 Template Structure

```text
atp-micropayment-agent/
├── agent/                      # AI Agent (ADK-TS)
│   ├── src/
│   │   ├── agents/
│   │   │   └── atp-micropayment-agent/
│   │   │       ├── agent.ts    # Agent behaviour + instructions
│   │   │       └── tools.ts    # Payment-enabled ATP tools
│   │   └── env.ts              # Environment configuration
│   ├── package.json
│   └── README.md
├── server/                     # Payment Server (Hono + x402)
│   ├── src/
│   │   └── index.ts            # x402 middleware & ATP proxy routes
│   ├── package.json
│   └── README.md
├── package.json                # Root workspace configuration
└── README.md
```

## 🔧 Customizing the Template

### Adding New Agent Tools

1. **Create new tools** in `agent/src/agents/atp-micropayment-agent/tools.ts`:

```typescript
const getNewTool = createTool({
  name: "GET_NEW_TOOL",
  description: "Description of your new tool",
  schema: z.object({
    param: z.string().describe("Parameter description"),
  }),
  fn: async ({ param }) => {
    const response = await apiClient.get(`/api/new-endpoint`, {
      params: { param },
    });
    return response.data;
  },
});
```

1. **Add to clientTools** array and update agent instructions

### Adding New Payment Endpoints

1. **Add endpoint to server** in `server/src/index.ts`:

```typescript
// Add to PAID_ROUTES configuration
const PAID_ROUTES = {
  // ... existing routes
  "/api/new-endpoint": { price: "$0.05", network },
};

// Add route handler
app.get("/api/new-endpoint", async (c) => {
  // Your endpoint logic here
});
```

1. **Update agent tools** to use the new endpoint

### Changing Payment Prices

Modify the `PAID_ROUTES` object in `server/src/index.ts`:

```typescript
const PAID_ROUTES: Record<string, { price: string; network: Network }> = {
  "/api/prices": { price: "$0.02", network }, // Changed from $0.01
  // ... other routes
};
```

### Using Different Networks

Update the network configuration in your server `.env`:

```env
NETWORK=mainnet  # or polygon, optimism, etc.
```

## 🐛 Troubleshooting

### "Failed to connect to payment server"

- Ensure the server is running on `http://localhost:3001`
- Check that your `.env` files are properly configured
- Verify your wallet has sufficient Base Sepolia ETH or other tokens for payments

### "Invalid private key" or "Wallet connection failed"

- Verify the private key is valid and funded with Base Sepolia ETH
- Check that the address matches between agent and server config

### "Google API key invalid"

- Ensure the API key is from [Google AI Studio](https://aistudio.google.com/api-keys)
- Make sure there are no extra spaces in your `.env` file
- Verify the key has proper permissions for Gemini API

### "Agent tools not responding"

- Verify the payment server is running and accessible
- Check server logs for any API proxy errors
- Ensure IQ AI ATP API is accessible from your location

## 📚 Learn More

### ADK-TS Resources

- [ADK-TS Documentation](https://adk.iqai.com/)
- [ADK-TS CLI Documentation](https://adk.iqai.com/docs/cli)
- [GitHub Repository](https://github.com/IQAICOM/adk-ts)

### x402 Protocol Resources

- [x402 Protocol Overview](https://www.coinbase.com/developer-platform/products/x402)
- [x402 Protocol Documentation](https://www.x402.org/)
- [x402 GitHub Repository](https://github.com/coinbase/x402)

### IQ AI ATP Resources

- [IQ AI Agent Tokenization Platform (ATP)](https://iqai.com/)
- [ATP API Documentation](https://gist.github.com/Royal-lobster/b2c236d57e94ac0c716f37ffbdbf236c)

## 🤝 Contributing

This sample is part of the [ADK-TS Samples](https://github.com/IQAIcom/adk-ts-examples) repository. Contributions are welcome! Feel free to:

- Report bugs or suggest improvements
- Add new tool examples
- Improve documentation
- Share your customizations

---

**💰 Ready to monetize?** Use this sample as a launchpad for x402-powered ATP experiences.
