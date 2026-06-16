<div align="center">
  <img src="https://files.catbox.moe/vumztw.png" alt="ADK-TS Logo" width="80" />
  <br/>
  <h1>Telegram Personal Assistant</h1>
  <b>Sample agent demonstrating intelligent task management and Telegram bot integration with the <code>ADK-TS</code> framework</b>
  <br/>
  <i>Multi-agent • Telegram Bot • PostgreSQL • TypeScript</i>
</div>

---

An AI-powered personal productivity assistant that helps you manage reminders and shopping lists through Telegram. Features a multi-agent architecture with specialized sub-agents, natural language time parsing, recurring reminders, and automatic notifications. Demonstrates state persistence, agent orchestration, and real-time Telegram integration.

## Features

- 🔔 **Smart Reminder Management**: Add, schedule, and manage reminders with flexible natural language time parsing
- 🔄 **Recurring Reminders**: Daily, weekly, and monthly recurring schedules with custom intervals
- 📱 **Telegram Bot Integration**: Real-time messaging and automatic notifications
- 🛒 **Shopping List Assistant**: Track shopping items with quantities and completion status
- 🤖 **Multi-Agent Architecture**: Specialized sub-agents for different task domains
- 💾 **State Persistence**: PostgreSQL database for reliable data storage
- ⏰ **Background Notifications**: Automatic monitoring and notification service
- 🧠 **Natural Language Understanding**: Context-aware request routing and processing

## Architecture and Workflow

This project demonstrates a hierarchical multi-agent system with specialized sub-agents and background services:

1. **TaskMaster Agent** (`personal_agent`) - Main coordinator that routes user requests to specialized sub-agents
2. **Telegram Agent** (`telegram_agent`) - Handles Telegram bot integration and message communication
3. **Reminder Agent** (`task_manager`) - Manages reminders, scheduling, and recurring tasks
4. **Shopping List Agent** (`shopping_assistant`) - Handles shopping list operations and item tracking
5. **Notification Service** - Background service that monitors for due reminders and sends Telegram notifications

### Project Structure

```text
├── src/
│   ├── agents/
│   │   ├── task-master-agent/
│   │   │   ├── agent.ts                      # Main coordinator agent
│   │   │   └── sub-agents/
│   │   │       ├── reminder-agent/
│   │   │       │   ├── agent.ts              # Reminder management logic
│   │   │       │   └── tools.ts              # 12 reminder tools
│   │   │       └── shopping-list-agent/
│   │   │           ├── agent.ts              # Shopping list logic
│   │   │           └── tools.ts              # 6 shopping tools
│   │   └── telegram-agent/
│   │       ├── agent.ts                      # Telegram bot interface
│   │       └── tools.ts                      # Telegram communication
│   ├── services/
│   │   └── reminder-notification.ts          # Background notification service
│   ├── types.ts                              # TypeScript type definitions
│   ├── env.ts                                # Environment validation
│   └── index.ts                              # Main application entry
```

### Data Flow

```mermaid
graph TB
    %% External Interfaces
    User((User))
    TelegramAPI[Telegram Bot API]
    Database[(PostgreSQL Database)]
    GoogleAI[Google Gemini API]

    %% Main System Components
    TelegramAgent[🤖 Telegram Agent<br/>telegram_agent]
    TaskMasterAgent[🎯 TaskMaster Agent<br/>personal_agent]
    ReminderAgent[⏰ Reminder Agent<br/>task_manager]
    ShoppingAgent[🛒 Shopping List Agent<br/>shopping_assistant]
    NotificationService[🔔 Reminder Notification Service]

    %% User Interaction Flow
    User -->|Telegram Messages| TelegramAPI
    TelegramAPI -->|Bot Integration| TelegramAgent
    TelegramAgent -->|Route Requests| TaskMasterAgent

    %% Agent Hierarchy and Routing
    TaskMasterAgent -->|Reminder/Task Requests| ReminderAgent
    TaskMasterAgent -->|Shopping List Requests| ShoppingAgent

    %% State and Data Management
    TaskMasterAgent -.->|Read/Write State| Database
    ReminderAgent -.->|Manage Reminders| Database
    ShoppingAgent -.->|Manage Shopping Lists| Database

    %% AI Processing
    TelegramAgent -.->|Language Processing| GoogleAI
    TaskMasterAgent -.->|Intent Understanding| GoogleAI
    ReminderAgent -.->|Natural Language Parsing| GoogleAI
    ShoppingAgent -.->|Request Processing| GoogleAI

    %% Background Services
    NotificationService -->|Monitor Reminders| Database
    NotificationService -->|Send Notifications| TelegramAgent
    NotificationService -.->|Schedule Management| ReminderAgent

    %% Response Flow
    ReminderAgent -->|Results| TaskMasterAgent
    ShoppingAgent -->|Results| TaskMasterAgent
    TaskMasterAgent -->|Formatted Response| TelegramAgent
    TelegramAgent -->|Send Message| TelegramAPI
    TelegramAPI -->|Deliver Message| User

    %% Styling
    classDef agentClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef serviceClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef externalClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef dataClass fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px

    class TelegramAgent,TaskMasterAgent,ReminderAgent,ShoppingAgent agentClass
    class NotificationService serviceClass
    class User,TelegramAPI,GoogleAI externalClass
    class Database dataClass
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database for state persistence
- Google AI API key (Gemini) for LLM access
- Telegram bot token from @BotFather

### Installation

1. Clone this repository

```bash
git clone https://github.com/IQOfficial/adk-ts-samples.git
cd adk-ts-samples/apps/telegram-personal-assistant
```

2. Install dependencies

```bash
pnpm install
```

3. Get Your API Keys
   - **Google AI API Key**: Visit [Google AI Studio](https://aistudio.google.com/api-keys) and create an API key
   - **Telegram Bot Token**: Create a new bot with [@BotFather](https://t.me/botfather) and get your bot token
   - **Telegram Channel ID**: Get your channel/chat ID where you want notifications sent
   - **PostgreSQL Database**: Set up a [PostgreSQL database](https://www.postgresql.org/) for state persistence

4. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
GOOGLE_API_KEY=your_google_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHANNEL_ID=your_telegram_channel_id
```

### Running the Assistant

```bash
# Start the bot
pnpm dev

# Interactive testing with ADK CLI
adk run   # CLI chat interface
adk web   # Web interface
```

Once the assistant is running, you can interact with it via Telegram.

## Usage Examples

The assistant intelligently routes your requests to the appropriate specialized agent. Here's a sample interaction:

```text
👤 User: Hi! Can you remind me to call mom tomorrow at 3pm?
🤖 Agent: I'll help you add that reminder. Let me connect you with my reminder assistant...
         ✅ Scheduled reminder: "call mom" for December 1, 2024 at 3:00 PM
         You'll receive a notification when it's due!
👤 User: Also, add milk and bread to my shopping list
🤖 Agent: I'll help you manage your shopping list...
         ✅ Added 1 milk to your shopping list
         ✅ Added 1 bread to your shopping list
```

**Example Reminder Commands:**

- "Remind me to call mom tomorrow at 3pm"
- "Add a task to finish the project"
- "What are my reminders?"
- "Schedule a daily reminder to take vitamins at 8am"
- "Show me upcoming reminders in the next 24 hours"
- "Update my first reminder"
- "Delete the second reminder"

**Example Shopping List Commands:**

- "Add milk to my shopping list"
- "Add 3 apples to shopping"
- "What's on my shopping list?"
- "Mark bread as completed"
- "Update the first item to 2 bananas"
- "Clear completed items"

**Key Features Demonstrated:**

- **Natural Language Time Parsing**: "tomorrow at 3pm", "in 2 hours", "next Monday"
- **Recurring Reminders**: "daily reminder", "weekly reminder every Monday", "monthly"
- **Context Awareness**: Maintains conversation context across multiple requests
- **Automatic Routing**: Intelligently routes to reminder or shopping list agent
- **Real-time Notifications**: Telegram alerts when reminders are due

## Real-World Use Cases

The **multi-agent task routing with Telegram integration** pattern in this project applies to any personal productivity or notification-driven workflow. Here are examples of what you can build by extending this assistant:

### Team Standup Bot

Replace reminders with standup prompts. The agent asks each team member for their daily update at a scheduled time, collects responses, and posts a formatted standup summary to a shared Telegram channel.

### Habit Tracker & Accountability Partner

Extend the recurring reminder system into a habit tracker. The agent logs daily completions, tracks streaks, sends motivational nudges when habits are missed, and produces weekly progress reports via Telegram.

### Expense Tracker Assistant

Swap shopping lists for expense tracking. Users send receipts or expense descriptions via Telegram, the agent categorizes spending, maintains running totals by category, and generates monthly budget summaries.

### How to Adapt This Pattern

The core architecture generalizes to any Telegram-powered productivity agent:

| Component                | What to Customize                                  | Example                                                     |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------------- |
| **Sub-Agents**           | Add or replace specialized agents for new domains  | Add a fitness tracking agent alongside reminders            |
| **Tools**                | Create new tools for your domain's CRUD operations | Add expense tools: `add_expense`, `view_expenses`, `budget` |
| **Notification Service** | Adjust monitoring logic and alert triggers         | Send weekly digest instead of per-reminder notifications    |
| **Database Schema**      | Extend PostgreSQL tables for new data types        | Add expense categories and budget thresholds tables         |

You can also **add integrations** — connect Google Calendar for syncing reminders, or add a Notion MCP server for cross-platform task management.

## Agent Tools and Capabilities

### 🤖 Telegram Agent Tools

| Tool        | Purpose                                                               |
| ----------- | --------------------------------------------------------------------- |
| McpTelegram | Telegram bot integration, message handling, and channel communication |

### ⏰ Reminder Agent Tools (12 Tools)

| Tool                          | Purpose                                                    |
| ----------------------------- | ---------------------------------------------------------- |
| `add_reminder`                | Add simple reminders to the list                           |
| `view_reminders`              | Display all current reminders                              |
| `update_reminder`             | Modify existing reminder text, time, or recurring schedule |
| `delete_reminder`             | Remove reminders by index                                  |
| `schedule_reminder`           | Schedule reminders for specific ISO date/time              |
| `schedule_reminder_with_time` | Schedule with flexible natural language time parsing       |
| `get_current_time`            | Retrieve current date and time information                 |
| `view_reminders_by_type`      | Filter reminders (scheduled, recurring, immediate, all)    |
| `get_upcoming_reminders`      | Show reminders due within specified hours                  |
| `stop_recurring_reminder`     | Convert recurring reminders to one-time                    |
| `modify_recurring_schedule`   | Change recurring patterns (daily/weekly/monthly)           |
| `get_next_recurring_time`     | Calculate next occurrence of recurring reminders           |

### 🛒 Shopping List Agent Tools (6 Tools)

| Tool                    | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `add_item`              | Add items to shopping list with optional quantities |
| `view_shopping_list`    | Display all shopping items (pending and completed)  |
| `update_item`           | Modify item name or quantity by index               |
| `delete_item`           | Remove items from the list by index                 |
| `mark_item_completed`   | Toggle completion status of items                   |
| `clear_completed_items` | Remove all completed items from the list            |

### 🔔 Notification Service

| Function                    | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| Monitor Due Reminders       | Check for reminders that need to be triggered |
| Send Telegram Notifications | Deliver reminder alerts via Telegram          |
| Handle Recurring Reminders  | Automatically schedule next occurrences       |
| State Synchronization       | Update database with reminder status changes  |

## Troubleshooting

### Common Issues

- **Database connection errors**: Ensure PostgreSQL is running and DATABASE_URL is correct
- **Telegram bot not responding**: Verify TELEGRAM_BOT_TOKEN and that the bot is started
- **Notifications not working**: Check TELEGRAM_CHANNEL_ID and bot permissions
- **Google AI errors**: Ensure GOOGLE_API_KEY is valid and has sufficient quota
- **Time parsing issues**: Use specific times (e.g., "tomorrow at 3pm") instead of vague terms like "later".

## Useful Resources

### ADK-TS Framework

- [ADK-TS Documentation](https://adk.iqai.com/)
- [ADK-TS CLI Documentation](https://adk.iqai.com/docs/cli)
- [ADK-TS Samples Repository](https://github.com/IQOfficial/adk-ts-samples)
- [ADK-TS GitHub Repository](https://github.com/IQOfficial/adk-ts)

### APIs & Services

- [Google AI Studio](https://aistudio.google.com/) (for API keys)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram BotFather](https://t.me/botfather) (create bots)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community

- [ADK-TS Discussions](https://github.com/IQOfficial/adk-ts/discussions)
- [ADK-TS Builders Community](https://t.me/+Z37x8uf6DLE3ZTQ8)
- [IQ AI Community](https://t.me/IQOfficial)

## Contributing

This Telegram Personal Assistant is part of the [ADK-TS Samples](https://github.com/IQOfficial/adk-ts-samples) repository, a collection of sample projects demonstrating ADK-TS capabilities.

We welcome contributions to the ADK-TS Samples repository! You can:

- **Add new sample projects** showcasing different ADK-TS features
- **Improve existing samples** with better documentation, new features, or optimizations
- **Fix bugs** in current implementations
- **Update dependencies** and keep samples current

Please see our [Contributing Guide](../../CONTRIBUTION.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**🤖 Ready to build your own Telegram bot?** This sample demonstrates multi-agent architecture, state persistence, and real-time bot integration with ADK-TS.
