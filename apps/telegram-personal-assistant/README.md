# 📝 TaskMaster Bot

Your intelligent personal productivity assistant powered by the `@iqai/adk` library. TaskMaster helps you master your daily tasks by managing reminders and shopping lists via Telegram, featuring smart sub-agents and automatic notifications to keep you organized and on track.

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

## 📁 Project Structure

```
├── src/
│   ├── agents/
│   │   ├── task-master-agent/
│   │   │   ├── agent.ts               # Main task master coordinator agent
│   │   │   └── sub-agents/
│   │   │       ├── reminder-agent/
│   │   │       │   ├── agent.ts       # Reminder management logic
│   │   │       │   └── tools.ts       # Reminder tools and actions
│   │   │       └── shopping-list-agent/
│   │   │           ├── agent.ts       # Shopping list management
│   │   │           └── tools.ts       # Shopping list tools
│   │   └── telegram-agent/
│   │       ├── agent.ts               # Telegram bot interface agent
│   │       └── tools.ts               # Telegram communication tools
│   ├── services/
│   │   └── reminder-notification.ts   # Automatic notification service
│   ├── types.ts                       # TypeScript type definitions
│   ├── env.ts                         # Environment validation
│   └── index.ts                       # Main application entry point
```

## 💬 How to Use

Once TaskMaster is running, you can interact with it via Telegram:

### Reminder Commands

- "Remind me to call mom tomorrow at 3pm"
- "Add a task to finish the project"
- "What are my reminders?"
- "Schedule a daily reminder to take vitamins at 8am"
- "Update my first reminder"

### Shopping List Commands

- "Add milk to my shopping list"
- "Add 3 apples to shopping"
- "What's on my shopping list?"
- "Mark bread as completed"
- "Clear completed items"

TaskMaster intelligently understands your requests and routes them to the appropriate assistant while maintaining context across conversations.

## 🧰 Tech Stack

- **[@iqai/adk](https://github.com/IQAICOM/adk-ts)**: AI agent development kit
- **TypeScript**: Type-safe development
- **PostgreSQL**: Persistent state storage
- **Telegram Bot API**: Real-time messaging interface
- **Google Gemini**: Large language model
- **Node.js**: Runtime environment

## 🏗️ Architecture

### Agent Hierarchy

```
TaskMaster Agent (Main Coordinator)
├── Reminder Agent
│   ├── Add/View/Update/Delete reminders
│   ├── Schedule with flexible time parsing
│   ├── Recurring reminder management
│   └── Upcoming reminder queries
└── Shopping List Agent
    ├── Add/View/Update/Delete items
    ├── Mark items as completed
    ├── Quantity management
    └── List organization

Telegram Agent (Communication Interface)
├── Telegram bot integration
├── Message handling and routing
├── Real-time notification delivery
└── User interaction management
```

### Key Components

- **TaskMaster Agent**: Main coordinator that understands user intent and routes to specialized sub-agents
- **Telegram Agent**: Handles Telegram bot integration, message processing, and real-time communication
- **Sub-Agents**: Specialized agents for reminders and shopping lists with their own tools and logic
- **Notification Service**: Background service that monitors for due reminders and sends Telegram notifications
- **State Management**: Persistent storage of user data with database sessions
- **Tool System**: Modular functions that agents can use to perform specific actions

## 🧰 Dev Tools

This project includes:

- 🏗️ **TypeScript**: Type safety and better developer experience
- 📦 **PNPM**: Fast and efficient package manager
- 🔧 **tsx**: Fast TypeScript execution for development
- 🗄️ **PostgreSQL**: Robust database for state persistence
- ⚡ **Hot reload**: Automatic restart during development

## 🎯 Extending TaskMaster

### Adding New Sub-Agents

1. Create a new agent in `src/agents/task-master-agent/sub-agents/`
2. Define tools in the agent's `tools.ts` file
3. Register the agent in `src/agents/task-master-agent/agent.ts`
4. Update TaskMaster's instructions to route to your new agent

### Adding New Main Agents

1. Create a new agent directory in `src/agents/`
2. Implement the agent with its tools and functionality
3. Initialize and wire the agent in `src/index.ts`
4. Update the routing logic as needed

### Adding New Tools

1. Create tools using `createTool()` from `@iqai/adk`
2. Define the tool's schema with Zod validation
3. Implement the tool's functionality with state management
4. Add the tool to the appropriate agent

### Customizing Behavior

- Modify agent instructions in the respective agent files
- Update the task master agent's routing logic
- Customize notification messages in `reminder-notification.ts`
- Add new data types in `types.ts`

## 📚 Links

- [ADK Library Documentation](https://github.com/IQAICOM/adk-ts)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google AI Studio](https://aistudio.google.com/) (for API keys)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

- **Database connection errors**: Ensure PostgreSQL is running and DATABASE_URL is correct
- **Telegram bot not responding**: Verify TELEGRAM_BOT_TOKEN and that the bot is started
- **Notifications not working**: Check TELEGRAM_CHANNEL_ID and bot permissions
- **Google AI errors**: Ensure GOOGLE_API_KEY is valid and has sufficient quota
