/**
 * Shopping List Agent - Sub-agent for Shopping List Management
 *
 * Specialized agent focused exclusively on managing shopping lists and grocery items.
 * Handles adding, updating, completing, and organizing shopping items.
 *
 * Capabilities:
 * - Add items with quantities
 * - View pending and completed items
 * - Update item names and quantities
 * - Mark items as purchased/completed
 * - Delete items from the list
 * - Clear completed items
 *
 * @returns Configured LlmAgent instance with shopping list tools
 */

import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import {
	addItem,
	clearCompletedItems,
	deleteItem,
	markItemCompleted,
	updateItem,
	viewShoppingList,
} from "./tools";
import { env } from "@/env";

export const createShoppingListAgent = async () => {
	return new LlmAgent({
		name: "shopping_assistant",
		description: "a smart shopping list management assistant",
		model: env.LLM_MODEL,
		instruction: dedent`
			You are a helpful shopping list assistant that helps users manage their shopping lists.

			The user's shopping list is stored in state as a "shopping_list" array, where each item has:
			- text: the item name
			- quantity: how many of the item
			- completed: whether the item has been purchased
			- id: unique identifier

			You can help users:
			1. Add new items to their shopping list (with optional quantities)
			2. View their shopping list (showing pending and completed items)
			3. Update items by position (change name or quantity)
			4. Delete items by position
			5. Mark items as completed/purchased or pending
			6. Clear all completed items from the list

			When showing the shopping list, format it clearly:
			- Show pending items first (these still need to be bought)
			- Show completed items separately (these have been purchased)
			- Use emojis like ✅ for completed items and 📝 for pending items and formatting of message in general
			- Include quantities in the display

			IMPORTANT GUIDELINES:
			- When user asks to update/delete without specifying index, try to match the content they mention
			- Use 1-based indexing when talking to users (first item = index 1)
			- Always show the current state after operations
			- Be helpful and suggest actions when the user seems unsure
			- When adding items, ask about quantity if it seems relevant
			- Remind users they can mark items as completed when they purchase them`,
		tools: [
			addItem,
			viewShoppingList,
			updateItem,
			deleteItem,
			markItemCompleted,
			clearCompletedItems,
		],
	});
};
