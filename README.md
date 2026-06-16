<div align="center">
  <img src="https://files.catbox.moe/vumztw.png" alt="ADK-TS Logo" width="80" />
  <br/>

  <h1>ADK-TS Samples</h1>
  <b>ADK-TS — The TypeScript-Native AI Agent Framework</b>
  <br />
  <i>Sample Projects • Agent Samples • Learning Resources</i>

  <p align="center">
    <a href="https://github.com/IQOfficial/adk-ts/blob/main/LICENSE.md">
      <img src="https://img.shields.io/npm/l/@iqai/adk" alt="License" />
    </a>
    <a href="https://github.com/IQOfficial/adk-ts-samples">
      <img src="https://img.shields.io/github/stars/IQOfficial/adk-ts-samples?style=social" alt="GitHub Stars" />
    </a>
  </p>
</div>

---

Welcome to the ADK-TS Samples repository! This collection provides ready-to-use sample projects built with [ADK-TS](https://adk.iqai.com), an open-source framework for building production-ready AI agents in TypeScript. These samples cover a range of complexities, from simple conversational agents to complex multi-agent workflows.

## ✨ Getting Started

This repository contains ADK-TS sample agents and projects. Navigate to the **[apps/](apps/)** folder to see setup instructions and learn more about the available samples.

> [!IMPORTANT]  
> The samples in this repository are built using **ADK-TS**. Before you can run any of the samples, you must have ADK-TS installed. For instructions, please refer to the [**ADK-TS Installation Guide**](https://adk.iqai.com/docs/framework/get-started/installation).

To learn more, check out the [ADK-TS Documentation](https://adk.iqai.com/docs), and the main [ADK-TS GitHub repository](https://github.com/IQOfficial/adk-ts).

## 🌳 Repository Structure

```text
├── apps/                  # Sample agent projects
│   ├── README.md          # Setup and testing guide
│   └── [sample-projects]/  # Individual example projects
├── .github/               # GitHub templates and workflows
└── README.md              # This file
```

## ℹ️ Getting Help

If you have any questions or if you found any problems with this repository, please report through [GitHub issues](https://github.com/IQOfficial/adk-ts-samples/issues).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- TypeScript knowledge

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/IQOfficial/adk-ts-samples.git
   cd adk-ts-samples
   ```

2. **Explore the samples**

   ```bash
   cd agents
   # Follow the setup instructions in agents/README.md
   ```

3. **Run an example**

   Each example includes its own setup and run instructions. Check the individual project directories for specific requirements.

## 📚 Available Samples

| Agent Name                  | Use Case                                                                                                  | Learn                                                                                                              | Tag                                     | Interaction Type | Complexity   | Agent Type   | Vertical        |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ---------------- | ------------ | ------------ | --------------- |
| Research Assistant          | Sequential 4-step research pipeline: web search, analysis, recommendations, and report synthesis          | Sequential agents, State-driven data flow, Before/after callbacks, Session state, Memory service, Tool integration | `research`, `analysis`, `sequential`    | Workflow         | Intermediate | Multi-agent  | General         |
| ATP Micropayment Agent      | AI agent with monetized API endpoints and web server using x402 protocol for payment handling             | API proxying, Payment middleware, x402 integration                                                                 | `monetization`, `payments`, `api`       | REST API + Agent | Intermediate | Agentic API  | General         |
| Telegram Personal Assistant | Personal productivity assistant managing reminders and shopping lists with Telegram notifications         | Multi-agent architecture, Telegram integration, Persistent state management, Notification services                 | `productivity`, `telegram`, `reminders` | Conversational   | Intermediate | Multi-agent  | General         |
| Crypto Tax Agent            | On-chain transaction analysis, tax event classification, and tax report generation                        | Blockchain integration, Cost basis calculation, Report generation, Session state management                        | `crypto`, `tax`, `blockchain`, `defi`   | Conversational   | Intermediate | Single Agent | Finance         |
| DeBank Portfolio Analyzer   | Multi-chain portfolio analysis using DeBank data (balances, tokens, protocols, NFTs); debank-mcp adoption | MCP integration, debank-mcp, McpToolset, DeBank API, Single-agent tool orchestration                               | `portfolio`, `debank`, `mcp`, `defi`    | Conversational   | Intermediate | Single Agent | Web3/DeFi       |
| DAO Proposal Analyzer       | Multi-chain DAO proposal analysis and voting recommendations (Ethereum + Fraxtal L2)                      | Sequential agents, Multi-chain viem integration, Governance analysis, Multi-agent orchestration                    | `dao`, `governance`, `web3`, `voting`   | Workflow         | Advanced     | Multi-agent  | Web3/Governance |
| Social Media Drafting Agent | Turns any blog URL into LinkedIn, X, and Threads drafts (single post or 2–10 post threads)                | Single LlmAgent, WebFetchTool, cache + retry plugins, Zod output schema, Next.js server actions                    | `content`, `social`, `nextjs`           | Workflow         | Intermediate | Single Agent | General         |
| Customer Support Agent      | Web chat UI and terminal CLI for Acme Corp support: policy Q&A, live order/account lookup, and escalation | FileOperationsTool, HttpRequestTool, createTool, Session state, React + Vite frontend, Node HTTP server            | `support`, `tools`, `session-state`     | Conversational   | Beginner     | Single Agent | General         |

## 🤝 Contributing

We welcome contributions! Whether you want to:

- Add new sample projects
- Improve existing samples
- Fix bugs or issues
- Enhance documentation

Please check out our [Contributing Guide](CONTRIBUTION.md) for detailed information on how to contribute to this repository.

## 🌍 Community

Join our community to discuss ideas, ask questions, and share your projects:

- [GitHub Discussions](https://github.com/IQOfficial/adk-ts/discussions)
- [ADK-TS Builders Community](https://t.me/+Z37x8uf6DLE3ZTQ8)
- [IQ AI Community](https://t.me/IQOfficial)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimers

This project is intended for demonstration purposes only. It is not intended for use in a production environment.

---

**Ready to build your first AI agent?** Visit [https://adk.iqai.com](https://adk.iqai.com) to get started!
