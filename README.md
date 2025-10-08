<div align="center">

<img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="100" />

<br/>

# ADK-TS Samples

**Real-world sample projects and agents built with ADK-TS (Agent Development Kit for TypeScript) to demonstrate framework capabilities and best practices.**

_Sample Projects • Agent Samples • Learning Resources_

<p align="center">
  <a href="https://github.com/IQAIcom/adk-ts/blob/main/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@iqai/adk" alt="License" />
  </a>
  <a href="https://github.com/IQAIcom/adk-ts-samples">
    <img src="https://img.shields.io/github/stars/IQAIcom/adk-ts-samples?style=social" alt="GitHub Stars" />
  </a>
</p>

---

</div>

Welcome to the ADK-TS Samples repository! This collection provides ready-to-use sample projects and agents built with the [Agent Development Kit (ADK) for TypeScript](https://adk.iqai.com), designed to demonstrate real-world use cases and accelerate your development process. These samples cover a range of complexities, from simple conversational agents to complex multi-agent workflows.

## ✨ Getting Started

This repository contains ADK-TS sample agents and projects. Navigate to the **[agents/](agents/)** folder to see setup instructions and learn more about the available samples.

> [!IMPORTANT]  
> The samples in this repository are built using **ADK-TS (Agent Development Kit for TypeScript)**. Before you can run any of the samples, you must have ADK-TS installed. For instructions, please refer to the [**ADK-TS Installation Guide**](https://adk.iqai.com/docs/framework/get-started/installation).

To learn more, check out the [ADK-TS Documentation](https://adk.iqai.com/docs), and the main [ADK-TS GitHub repository](https://github.com/IQAIcom/adk-ts).

## 🌳 Repository Structure

```text
├── agents/                    # Sample agent projects
│   ├── README.md             # Setup and testing guide
│   └── [sample-projects]/    # Individual example projects
├── .github/                  # GitHub templates and workflows
└── README.md                # This file
```

## ℹ️ Getting Help

If you have any questions or if you found any problems with this repository, please report through [GitHub issues](https://github.com/IQAIcom/adk-ts-samples/issues).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- TypeScript knowledge

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/IQAIcom/adk-ts-samples.git
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

| Agent Name                  | Use Case                                                                                                                | Tag                                 | Interaction Type | Complexity   | Agent Type  | Vertical              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------- | ------------ | ----------- | --------------------- |
| 🧭 **InfoScout**            | Multi-source knowledge lookup agent that fetches and summarizes data from Wikipedia, Gemini, and news APIs.             | `research`, `chat`, `summarization` | Conversational   | Beginner     | Tool-based  | General               |
| 🌤️ **PlanPal**             | Context-aware daily planner that integrates calendar, weather, and traffic data to optimize schedules.                  | `productivity`, `automation`        | Workflow         | Beginner     | Multi-tool  | Lifestyle             |
| 🗞️ **TrendLens**           | Trend-tracking agent that analyzes news or crypto data, summarizes insights, and pushes updates to Telegram or Discord. | `automation`, `analysis`            | Workflow         | Beginner     | Tool-based  | Finance / Web3        |
| ✈️ **IQ Flights**           | Hierarchical multi-agent travel system that coordinates flight, hotel, and itinerary planning.                          | `travel`, `planning`                | Workflow         | Intermediate | Multi-agent | Travel                |
| 🧠 **TheraMind**            | Multi-agent mental health companion with therapy tools, journaling, and crisis detection.                               | `health`, `ai`, `mental-wellness`   | Conversational   | Intermediate | Multi-agent | Healthcare            |
| 💼 **BizBot**               | AI business operations assistant handling invoices, scheduling, and client communication.                               | `automation`, `enterprise`          | Workflow         | Intermediate | Multi-agent | Business              |
| 💰 **DeFi Analyst**         | Monitors DeFi protocols, tracks yield, and generates AI-driven risk assessments.                                        | `defi`, `analytics`                 | Workflow         | Advanced     | Tool-based  | Finance / Web3        |
| 🧾 **SmartTax Advisor**     | Reads wallet transactions, classifies activity, and generates tax summaries for users.                                  | `finance`, `automation`             | Workflow         | Advanced     | Multi-tool  | Finance / Web3        |
| 🤖 **DAO Strategist**       | Multi-agent governance system that analyzes proposals, simulates outcomes, and recommends votes for DAO members.        | `governance`, `dao`, `ai`           | Workflow         | Advanced     | Multi-agent | Web3 / Governance     |
| 🧩 **ChainBridge Operator** | Cross-chain asset transfer coordinator that uses AI agents to monitor bridge status and detect anomalies.               | `bridge`, `monitoring`, `security`  | Workflow         | Advanced     | Multi-agent | Web3 / Infrastructure |

## 🤝 Contributing

We welcome contributions! Whether you want to:

- Add new example projects
- Improve existing samples  
- Fix bugs or issues
- Enhance documentation

Please check out our [Contributing Guide](CONTRIBUTION.md) for detailed information on how to contribute to this repository.

## 🌍 Community

Join our community to discuss ideas, ask questions, and share your projects:

- [Discord Community](https://discord.gg/w2Uk6ACK4D)
- [GitHub Discussions](https://github.com/IQAIcom/adk-ts/discussions)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimers

This project is intended for demonstration purposes only. It is not intended for use in a production environment.

---

**Ready to build your first AI agent?** Visit [https://adk.iqai.com](https://adk.iqai.com) to get started!
