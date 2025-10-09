# 💡 ADK-TS Agent Ideas

This file contains a list of **agent ideas** that the dev team can build and include in the `adk-ts-samples` repo.
Each one represents a **real-world use case** designed to show how ADK-TS can be used in different ways — from simple tool-based agents to complex multi-agent systems.

The goal is to:

* Give devs a **starting point** if they’re not sure what to build
* Help us maintain a **diverse set of examples** that cover different skills, agent types, and domains
* Ensure each project stays **focused in scope** (not full MVPs), but works as a functional example using real data

Each idea includes:

* A short description of what the agent does
* Its use case, complexity, and type
* A brief scope summary (goals, features, limitations)

These examples should help new contributors and internal devs understand the **breadth of what’s possible with ADK-TS** — and make it easier for others to build upon them later.

> [!IMPORTANT]
> **Status Tracking:** When you start working on an agent, please update the Status column from "Available" to "WIP - @github_username" to avoid duplicate work. When completed, change it to "Built". This helps coordinate efforts across the team.

## 🚀 Proposed Agents

| Agent Name                  | Use Case                                                                                                                | Tag                                 | Interaction Type | Complexity   | Agent Type  | Vertical              | Status        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------- | ------------ | ----------- | --------------------- | ------------- |
| 🧭 **InfoScout**            | Multi-source knowledge lookup agent that fetches and summarizes data from Wikipedia, Gemini, and news APIs.             | `research`, `chat`, `summarization` | Conversational   | Beginner     | Tool-based  | General               | Available     |
| 🌤️ **PlanPal**             | Context-aware daily planner that integrates calendar, weather, and traffic data to optimize schedules.                  | `productivity`, `automation`        | Workflow         | Beginner     | Multi-tool  | Lifestyle             | Available     |
| 🗞️ **TrendLens**           | Trend-tracking agent that analyzes news or crypto data, summarizes insights, and pushes updates to Telegram or Discord. | `automation`, `analysis`            | Workflow         | Beginner     | Tool-based  | Finance / Web3        | Available     |
| ✈️ **IQ Flights**           | Hierarchical multi-agent travel system that coordinates flight, hotel, and itinerary planning.                          | `travel`, `planning`                | Workflow         | Intermediate | Multi-agent | Travel                | WIP - @Adebesin-Cell    |
| 🧠 **TheraMind**            | Multi-agent mental health companion with therapy tools, journaling, and crisis detection.                               | `health`, `ai`, `mental-wellness`   | Conversational   | Intermediate | Multi-agent | Healthcare            | WIP - @Timonwa |
| 💼 **BizBot**               | AI business operations assistant handling invoices, scheduling, and client communication.                               | `automation`, `enterprise`          | Workflow         | Intermediate | Multi-agent | Business              | Available     |
| 💰 **DeFi Analyst**         | Monitors DeFi protocols, tracks yield, and generates AI-driven risk assessments.                                        | `defi`, `analytics`                 | Workflow         | Advanced     | Tool-based  | Finance / Web3        | Available     |
| 🧾 **SmartTax Advisor**     | Reads wallet transactions, classifies activity, and generates tax summaries for users.                                  | `finance`, `automation`             | Workflow         | Advanced     | Multi-tool  | Finance / Web3        | Available     |
| 🤖 **DAO Strategist**       | Multi-agent governance system that analyzes proposals, simulates outcomes, and recommends votes for DAO members.        | `governance`, `dao`, `ai`           | Workflow         | Advanced     | Multi-agent | Web3 / Governance     | Available     |
| 🧩 **ChainBridge Operator** | Cross-chain asset transfer coordinator that uses AI agents to monitor bridge status and detect anomalies.               | `bridge`, `monitoring`, `security`  | Workflow         | Advanced     | Multi-agent | Web3 / Infrastructure | Available     |

## Scope Summaries

### 🧭 **InfoScout**

**Goal:** Create a lightweight research assistant that aggregates factual information from multiple sources like Wikipedia, Gemini, and a public news API. The agent should take a query (e.g., *“Explain quantum computing in simple terms”*) and respond with a concise, well-cited summary.
**Features:** Fetch structured data from APIs, merge overlapping facts, and summarize with an LLM. Include a simple citation system (source name + link). Limit to three external calls per query to ensure performance.
**Limitations:** No UI, real-time web scraping, or long-form report generation—just one short, verified summary per prompt.

### 🌤️ **PlanPal**

**Goal:** Build an intelligent daily planner that automatically optimizes a user’s day based on their schedule, weather, and commute time. The agent should read calendar data, check weather forecasts, and adjust timing suggestions accordingly.
**Features:** Integrate Google Calendar (read-only), OpenWeatherMap, and a Maps API. Provide short, natural-language summaries (e.g., “Leave 15 minutes early; it’ll rain in the afternoon”). Limit responses to same-day planning.
**Limitations:** No event creation or push notifications—text output only.

### 🗞️ **TrendLens**

**Goal:** Develop an agent that monitors trending topics (news or crypto), summarizes the most relevant insights, and sends digest updates to a Discord or Telegram channel.
**Features:** Use APIs like NewsAPI or CoinGecko to fetch data. Summarize trends using the LLM and output formatted text (headline + summary + link). Schedule runs every few hours.
**Limitations:** No real-time posting or continuous monitoring—batch analysis only (manual trigger or cron job).

### ✈️ **IQ Flights**

**Goal:** Implement a multi-agent travel assistant that finds and compares flights and hotels. The main agent delegates to a flight-search and hotel-search sub-agent for better modularity.
**Features:** Integrate Skyscanner (or Amadeus) and Booking.com APIs for live search. Output results in a unified format showing top 3 flight and hotel matches.
**Limitations:** No actual booking, payment, or user accounts—just planning and comparison.

### 🧠 **TheraMind**

**Goal:** Build a mental wellness companion that helps users reflect and manage their moods. It should act as a journaling and supportive conversational agent.
**Features:** Store journal entries locally or in a private DB, detect mood trends using sentiment analysis, and offer gentle prompts or grounding exercises. Include a “daily check-in” workflow.
**Limitations:** No diagnostics, therapy, or real-time intervention—strictly self-help and journaling.

### 💼 **BizBot**

**Goal:** Design a small-business assistant that helps manage daily operational tasks like scheduling, invoice reminders, and email drafting.
**Features:** Integrate with Google Calendar and a dummy invoicing API (like QuickBooks sandbox). The agent should respond to simple queries (“Show unpaid invoices” / “Schedule meeting with John”).
**Limitations:** No real transaction handling or email sending—generate draft responses only.

### 💰 **DeFi Analyst**

**Goal:** Create an analytics agent that monitors major DeFi protocols to assess yield opportunities and associated risks.
**Features:** Pull data from Aave, Compound, and IQ Staking APIs. Generate a compact “daily report” with APRs, TVL, and a short AI summary on protocol performance.
**Limitations:** Read-only; no staking or smart contract interaction.

### 🧾 **SmartTax Advisor**

**Goal:** Build a wallet analytics agent that reads on-chain transaction data and classifies it for tax summarization.
**Features:** Use Etherscan or Alchemy APIs to fetch transaction history. Categorize activity (trades, transfers, staking) and summarize totals per category in USD using real-time token prices.
**Limitations:** No export to external tax tools; output is a simple summarized JSON/Markdown report.

### 🤖 **DAO Strategist**

**Goal:** A governance analysis agent that helps DAO members make informed votes by summarizing active proposals and simulating outcomes.
**Features:** Connect to Snapshot or Tally APIs to fetch DAO proposals, use the LLM to summarize context, and provide a “pros/cons” style overview for each.
**Limitations:** No vote execution or wallet actions—recommendations only.

### 🧩 **ChainBridge Operator**

**Goal:** Create an AI-powered observer that tracks bridge activity between blockchains and detects potential delays or anomalies.
**Features:** Use APIs from LayerZero, Wormhole, or Axelar to monitor transaction status and compare latency metrics. The agent should generate an alert summary (e.g., “Bridge congestion on BNB → ETH: avg delay 15m”).
**Limitations:** No on-chain interactions—monitoring and reporting only.
