/**
 * Type Definitions
 *
 * Defines the core data structures used throughout the application.
 * These types ensure type safety across agents and services.
 */

/**
 * Reminder data structure
 * Represents a user's reminder with optional scheduling and recurring settings
 */
export type Reminder = {
	/** Unique identifier for the reminder */
	id: string;

	/** The reminder text/description */
	text: string;

	/** ISO timestamp when the reminder was created */
	createdAt: string;

	/** ISO timestamp when the reminder should trigger (optional) */
	scheduledTime?: string | null;

	/** Recurring schedule configuration (optional) */
	recurring?: {
		/** How often the reminder repeats */
		type: "daily" | "weekly" | "monthly";
		/** Interval multiplier (e.g., every 2 days) */
		interval?: number;
	};

	/** Classification type for the reminder (optional) */
	type?: string;
};

/**
 * Shopping list item data structure
 * Represents an item on the user's shopping list with quantity tracking
 */
export type ShoppingListItem = {
	/** Unique identifier for the item */
	id: string;

	/** The item name/description */
	text: string;

	/** How many of this item to buy */
	quantity: number;

	/** Whether the item has been purchased */
	completed: boolean;
};

/**
 * Application state structure
 * Persisted in the database and shared across all agents
 */
export type PersonalAgentState = {
	/** Array of all user reminders */
	reminders: Reminder[];

	/** Array of all shopping list items */
	shopping_list: ShoppingListItem[];
};
