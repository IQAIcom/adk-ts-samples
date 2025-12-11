# Crypto Tax Agent

AI-powered crypto tax assistant built with ADK-TS that fetches on-chain transactions, calculates cost basis using standard accounting methods (FIFO/LIFO/HIFO), and generates tax reports.

## Features

- 🔗 **Multi-Chain Support**: Ethereum, Base, and Fraxtal
- 📊 **Transaction Classification**: Automatically categorizes transactions (BUY, SELL, SWAP, INCOME, etc.)
- 💰 **Cost Basis Calculation**: Supports FIFO, LIFO, and HIFO accounting methods
- 📄 **Report Generation**: Creates tax reports in multiple formats:
  - IRS Form 8949 format
  - CSV export for tax software
  - Summary reports with totals
- ⚡ **Built on ADK-TS**: Leverages IQAI Agent Development Kit for reliable AI interactions

## Architecture

```
crypto-tax-agent/
├── src/
│   ├── agents/
│   │   └── crypto-tax-agent/
│   │       └── agent.ts          # Main agent with workflow logic
│   ├── tools/
│   │   ├── fetchTransactions.ts  # Blockchain transaction fetching
│   │   ├── classifyTransaction.ts # Tax event classification
│   │   ├── calculateCostBasis.ts # Capital gains calculation
│   │   └── generateReport.ts     # Report generation
│   ├── types.ts                  # TypeScript type definitions
│   ├── env.ts                    # Environment configuration
│   └── index.ts                  # Main entry point
├── .env.example                  # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `apps/crypto-tax-agent` directory:

```bash
cd apps/crypto-tax-agent
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
GOOGLE_API_KEY=your_google_api_key_here

# Optional: LLM model selection
LLM_MODEL=gemini-2.5-flash

# Blockchain explorer API key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Price data API
COINGECKO_API_KEY=your_coingecko_api_key

# Debug mode
ADK_DEBUG=false
```

## Usage

### Option 1: Interactive Terminal Chat

```bash
pnpm dev
# OR
adk run
```

### Option 2: Web Interface

```bash
adk web
```

### Option 3: Programmatic Usage

```typescript
import getCryptoTaxAgent from "./src/agents/crypto-tax-agent/agent.js";

const agent = await getCryptoTaxAgent();
const runner = agent.createRunner();

const response = await runner.ask(
	"Calculate my 2024 crypto taxes for wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb on Base",
);
```

## Example Workflow

1. **Start a conversation:**

   ```
   Hi! I need help calculating my crypto taxes for 2024.
   ```

2. **Provide wallet details:**

   ```
   My wallet address is 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb.
   Please fetch my transactions from Base blockchain for 2024.
   ```

3. **Classify transactions:**

   ```
   Great! Now please classify these transactions.
   ```

4. **Calculate cost basis:**

   ```
   Calculate the cost basis using FIFO method for 2024.
   ```

5. **Generate report:**
   ```
   Generate a summary report showing my capital gains.
   ```

## Tax Methods

### FIFO (First In, First Out)

- Most commonly used method
- Assumes oldest assets are sold first
- Generally results in higher capital gains in bull markets

### LIFO (Last In, First Out)

- Assumes newest assets are sold first
- Can result in lower gains if recent purchases were at higher prices

### HIFO (Highest In, First Out)

- Matches sales with highest cost basis acquisitions first
- Minimizes capital gains
- Requires detailed lot tracking

## Tax Implications

### Short-Term Capital Gains

- Assets held ≤ 365 days
- Taxed as ordinary income at your marginal tax rate

### Long-Term Capital Gains

- Assets held > 365 days
- Taxed at preferential rates (0%, 15%, or 20% depending on income)

### Income Events

- Staking rewards, airdrops, mining rewards
- Taxed as ordinary income at fair market value when received
- Creates a cost basis for future disposals

## Current Limitations

This is a **minimal implementation** designed for expansion:

- Mock price data (integrate CoinGecko API for production)
- Basic transaction classification (enhance with DEX/DeFi protocol detection)
- No database persistence (add for multi-session state management)
- Limited to EVM chains (expand to Bitcoin, Solana, etc.)
- No wash sale rule detection
- No handling of:
  - DeFi lending/borrowing
  - Liquidity pool positions
  - NFT transactions
  - Margin trading
  - Derivatives

## Extending the Agent

### Add New Chains

Edit `src/types.ts`:

```typescript
export type Chain = "ethereum" | "base" | "fraxtal";
```

Add chain config in `src/services/explorerService.ts`:

```typescript
const EXPLORER_CONFIGS: Record<Chain, ExplorerConfig> = {
	// ... existing chains
	polygon: {
		chainId: 137, // Polygon chain ID for Etherscan API V2
		nativeSymbol: "MATIC",
	},
};
```

### Add New Tools

Create a new tool file in `src/tools/`:

```typescript
import { createTool } from "@iqai/adk";
import { z } from "zod";

export const myNewTool = createTool({
	name: "my_new_tool",
	description: "Description of what this tool does",
	schema: z.object({
		param: z.string().describe("Parameter description"),
	}),
	fn: async ({ param }, { state }) => {
		// Tool implementation
		return { success: true, result: "..." };
	},
});
```

Register in `src/agents/crypto-tax-agent/agent.ts`:

```typescript
import { myNewTool } from "../../tools/myNewTool.js";

.withTools(
  fetchTransactionsTool,
  classifyTransactionTool,
  calculateCostBasisTool,
  generateReportTool,
  myNewTool  // Add new tool
)
```

## Development

### Build

```bash
pnpm build
```

### Run built version

```bash
pnpm start
```

### Clean build artifacts

```bash
pnpm clean
```
## Contributing

Contributions are welcome! Areas for improvement:

- Real-time price data integration
- Enhanced DeFi protocol support
- Multi-wallet portfolio tracking
- Tax optimization suggestions
- Export formats for popular tax software (TurboTax, TaxAct, etc.)

## License

MIT License - see LICENSE file for details