import { type McpConfig, McpToolset } from "@iqai/adk"
import { env } from "../../env"

export const getDebankTools = async () => {
    const debankMcpConfig: McpConfig = {
        name: "debank-mcp server",
        description: "MCP server for Debank API",
        transport: {
            mode: "stdio",
            command: "npx",
            args: ["-y", "@iqai/mcp-debank"],
            env: {
                DEBANK_API_KEY: env.DEBANK_API_KEY,
            },
        }
    }

    const debankMcpToolset = new McpToolset(debankMcpConfig);
    const tools = await debankMcpToolset.getTools();
    return tools;
}