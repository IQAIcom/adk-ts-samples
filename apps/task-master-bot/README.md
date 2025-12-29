<div align="center">
  <img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="100" />
  <br/>
  <h1>TaskMaster Bot</h1>
  <b>Sample agent demonstrating personal productivity management with Telegram integration using the <code>@iqai/adk</code> library</b>
  <br/>
  <i>Multi-Agent • Reminders • Shopping Lists • Telegram Bot</i>
</div>

---

An AI-powered personal productivity assistant built with ADK-TS that manages reminders and shopping lists via Telegram. Features a multi-agent architecture with specialized sub-agents for task management, automatic notifications, and persistent state storage for seamless productivity tracking.

## ✨ Features

### 🔔 Smart Reminder Management
- **Add reminders** with flexible time parsing ("in 2 hours", "tomorrow at 3pm", "next Monday")
- **Schedule reminders** for specific dates and times
- **Recurring reminders** (daily, weekly, monthly with custom intervals)
- **Automatic notifications** via Telegram when reminders are due
- **View and manage** all your reminders with filtering options

### � Shopping List Assistant
- **Add items** to your shopping list with quantities
- **Mark items as completed** when purchased
- **Update or delete** items easily
- **Clear completed items** to keep your list organized
- **View organized lists** with pending and completed sections

### 🤖 Intelligent Agent System
- **Multi-agent architecture** with specialized sub-agents
- **Natural language understanding** for routing requests
- **Persistent state management** with database storage
- **Context-aware responses** based on your history

## 🚀 Get Started

📦 Install the dependencies

```bash
pnpm install
```

## ⚙️ Environment Setup
Create a `.env` file with the following variables:

```bash
# Required: Google AI API key for the language model
GOOGLE_API_KEY=your_google_api_key_here

# Required: Database URL for persistent storage
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Required: Telegram bot token from @BotFather
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Required: Telegram channel/chat ID for notifications
TELEGRAM_CHANNEL_ID=your_telegram_channel_id

# Optional: Enable debug mode
ADK_DEBUG=false
```

### Setting up Telegram
1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token and add it to `.env`
3. Get your channel/chat ID where you want notifications sent

▶️ Run the agent

```bash
pnpm dev
```

### Project Structure

```text
task-master-bot/
├── src/
│   ├── agents/
│   │   ├── task-master-agent/
│   │   │   ├── agent.ts                  # Main task master coordinator agent
│   │   │   └── sub-agents/
│   │   │       ├── reminder-agent/
│   │   │       │   ├── agent.ts          # Reminder management logic
│   │   │       │   └── tools.ts          # Reminder tools and actions
│   │   │       └── shopping-list-agent/
│   │   │           ├── agent.ts          # Shopping list management
│   │   │           └── tools.ts          # Shopping list tools
│   │   └── telegram-agent/
│   │       ├── agent.ts                  # Telegram bot interface agent
│   │       └── tools.ts                  # Telegram communication tools
│   ├── services/
│   │   └── reminder-notification.ts      # Automatic notification service
│   ├── types.ts                          # TypeScript type definitions
│   ├── env.ts                            # Environment validation
│   └── index.ts                          # Main application entry point
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
└── README.md
```

### Data Flow

```mermaid
graph TB
    %% User Interaction
    User[👤 User Message] --> TelegramAgent[🤖 Telegram Agent<br/>Message Handler]

    %% Request Routing
    TelegramAgent --> TaskMaster[📋 TaskMaster Agent<br/>Main Coordinator]
    TaskMaster --> Route{🔀 Route Request}

    %% Reminder Flow
    Route -->|Reminder Request| ReminderAgent[⏰ Reminder Agent<br/>Reminder Management]
    ReminderAgent --> ReminderTools[🛠️ Reminder Tools<br/>Add/View/Update/Delete]
    ReminderTools --> Database[(💾 PostgreSQL Database<br/>Persistent Storage)]

    %% Shopping List Flow
    Route -->|Shopping Request| ShoppingAgent[🛒 Shopping List Agent<br/>List Management]
    ShoppingAgent --> ShoppingTools[🛠️ Shopping Tools<br/>Add/Mark/Update/Delete]
    ShoppingTools --> Database

    %% Response Flow
    Database --> Response[📝 Format Response]
    Response --> TelegramAgent
    TelegramAgent --> UserResponse[💬 Telegram Message<br/>to User]

    %% Background Notification Service
    Database --> NotificationService[🔔 Notification Service<br/>Background Process]
    NotificationService --> CheckReminders[⏲️ Check Due Reminders<br/>Every minute]
    CheckReminders --> SendNotification[📲 Send Telegram Notification]
    SendNotification --> TelegramAPI[📱 Telegram Bot API]

    %% Styling
    classDef userLayer fill:#e1f5fe,color:#01579b
    classDef agentLayer fill:#fff3e0,color:#e65100
    classDef storageLayer fill:#f3e5f5,color:#4a148c
    classDef serviceLayer fill:#e8f5e9,color:#1b5e20

    class User,UserResponse userLayer
    class TelegramAgent,TaskMaster,Route,ReminderAgent,ShoppingAgent,Response agentLayer
    class Database,ReminderTools,ShoppingTools storageLayer
    class NotificationService,CheckReminders,SendNotification,TelegramAPI serviceLayer
```

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL Database](https://www.postgresql.org/) for state persistence
- [Google AI API key](https://aistudio.google.com/api-keys) for LLM access
- [Telegram Bot](https://core.telegram.org/bots#how-do-i-create-a-bot) token and channel ID

### Installation

1. Clone this repository

```bash
git clone https://github.com/IQAIcom/adk-ts-samples.git
cd adk-ts-samples/apps/task-master-bot
```

2. Install dependencies

```bash
pnpm install
```

3. Get Your API Keys
   - **Google AI API Key**: Visit [Google AI Studio](https://aistudio.google.com/api-keys) and create an API key
   - **Telegram Bot Token**: Create a bot with [@BotFather](https://t.me/botfather) on Telegram
   - **Telegram Channel ID**: Get your chat/channel ID where notifications will be sent
   - **PostgreSQL Database**: Set up a PostgreSQL database (local or hosted)

4. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Google AI API key for the language model
GOOGLE_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash

# Database URL for persistent storage
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Telegram bot token from @BotFather
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Telegram channel/chat ID for notifications
TELEGRAM_CHANNEL_ID=your_telegram_channel_id

# Optional: Enable debug mode
ADK_DEBUG=false
```

### Running the Bot

```bash
# Start the bot in development mode
pnpm dev

# Interactive testing with ADK CLI
adk run   # CLI chat interface
adk web   # Web interface
```

Once running, start chatting with your bot on Telegram!

## Usage Examples

The bot handles complete productivity workflows through natural language on Telegram. Here's a sample interaction:

```text
👤 User: Hi! Can you help me stay organized?
🤖 Bot: Hello! I'm TaskMaster, your personal productivity assistant. I can help you with:
       • Smart reminders with flexible scheduling
       • Shopping list management
       • Recurring tasks and notifications
       
       What would you like to do today?

👤 User: Remind me to call mom tomorrow at 3pm
🤖 Bot: ✅ Reminder set! I'll remind you to "call mom" tomorrow at 3:00 PM.

👤 User: Add milk and 3 apples to my shopping list
🤖 Bot: ✅ Added to shopping list:
       • Milk (quantity: 1)
       • Apples (quantity: 3)

👤 User: What are my reminders?
🤖 Bot: 📋 Your Reminders:
       1. Call mom - Tomorrow at 3:00 PM
       2. Team meeting - Today at 5:00 PM
       3. Weekly review - Every Monday at 9:00 AM

👤 User: Show my shopping list
🤖 Bot: 🛒 Shopping List:
       Pending Items:
       • Milk (1)
       • Apples (3)
       • Bread (1)
       
       Completed: 2 items
```

**Example Reminder Commands:**

- "Remind me to call mom tomorrow at 3pm"
- "Add a task to finish the project by Friday"
- "Schedule a daily reminder to take vitamins at 8am"
- "Set a weekly reminder for team meeting every Monday"
- "What are my upcoming reminders?"
- "Update my first reminder"
- "Delete the reminder about groceries"

**Example Shopping List Commands:**

- "Add milk to my shopping list"
- "Add 3 apples and 2 oranges to shopping"
- "What's on my shopping list?"
- "Mark bread as completed"
- "Update milk quantity to 2"
- "Delete eggs from my list"
- "Clear all completed items"

## Extending TaskMaster

This bot demonstrates extensible patterns for building multi-agent productivity systems:

### Adding New Sub-Agents

1. Create a new agent directory in `src/agents/task-master-agent/sub-agents/`
2. Define the agent with tools in `agent.ts` and `tools.ts`
3. Register the sub-agent in the TaskMaster agent
4. Update TaskMaster's instructions to route requests to your new agent

### Adding New Tools

1. Create tools using `createTool()` from `@iqai/adk`
2. Define the tool's schema with Zod validation
3. Implement the tool's functionality with state management
4. Add the tool to the appropriate agent's tool array

### Customizing Behavior

- Modify agent instructions in respective agent files
- Update notification timing in `reminder-notification.ts`
- Add new data types in `types.ts`
- Extend database schema for additional features

## Useful Resources

### ADK-TS Framework

- [ADK-TS Documentation](https://adk.iqai.com/)
- [ADK-TS CLI Documentation](https://adk.iqai.com/docs/cli)
- [ADK-TS Samples Repository](https://github.com/IQAIcom/adk-ts-samples)
- [ADK-TS GitHub Repository](https://github.com/IQAIcom/adk-ts)

### APIs & Services

- [Google AI Studio](https://aistudio.google.com/api-keys) for API keys
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community

- [ADK-TS Discussions](https://github.com/IQAIcom/adk-ts/discussions)
- [Discord Community](https://discord.gg/w2Uk6ACK4D)

## Contributing

This TaskMaster Bot is part of the [ADK-TS Samples](https://github.com/IQAIcom/adk-ts-samples) repository, a collection of sample projects demonstrating ADK-TS capabilities.

We welcome contributions to the ADK-TS Samples repository! You can:

- **Add new sample projects** showcasing different ADK-TS features
- **Improve existing samples** with better documentation, new features, or optimizations
- **Fix bugs** in current implementations
- **Update dependencies** and keep samples current

Please see our [Contributing Guide](../../CONTRIBUTION.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**🤖 Ready to build your productivity assistant?** This sample demonstrates multi-agent architecture, Telegram integration, and automated notifications with ADK-TS.