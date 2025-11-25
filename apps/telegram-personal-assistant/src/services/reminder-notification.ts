import {
	type BaseSessionService,
	type EnhancedRunner,
	Event,
	EventActions,
	type Session,
} from "@iqai/adk";
import dedent from "dedent";
import { env } from "../env";
import type { PersonalAgentState, Reminder } from "../types";

/**
 * Reminder Notification Service
 *
 * Background service that monitors the database for due reminders and sends
 * automatic notifications via Telegram. Runs on a polling interval and handles:
 * - Checking for reminders that are due
 * - Sending Telegram notifications
 * - Managing recurring reminders (scheduling next occurrence)
 * - Updating database state after notifications are sent
 *
 * The service runs independently of user interactions and ensures users
 * are notified promptly when their reminders are due.
 */
export class ReminderNotificationService {
	/** Timer ID for the polling interval */
	private intervalId: NodeJS.Timeout | null = null;

	/** Whether the service is currently running */
	private isRunning = false;

	/** How often to check for due reminders (in milliseconds) */
	private readonly checkIntervalMs: number;

	/**
	 * Creates a new reminder notification service
	 *
	 * @param session - Current user session for accessing state
	 * @param sessionService - Service for reading/updating database state
	 * @param telegramRunner - Agent runner for sending Telegram messages
	 * @param checkIntervalMs - Polling interval in milliseconds (default from env)
	 */
	constructor(
		private readonly session: Session,
		private readonly sessionService: BaseSessionService,
		private readonly telegramRunner: EnhancedRunner,
		checkIntervalMs = env.REMINDER_POLLING_MS,
	) {
		this.checkIntervalMs = checkIntervalMs;
	}

	/**
	 * Start the reminder notification service
	 */
	start(): void {
		if (this.isRunning) {
			console.log("⚠️ Reminder notification service is already running");
			return;
		}

		this.isRunning = true;
		console.log("🔔 Starting reminder notification service...");

		this.intervalId = setInterval(async () => {
			try {
				await this.checkAndSendReminders();
			} catch (error) {
				console.error("❌ Error checking reminders:", error);
			}
		}, this.checkIntervalMs);

		console.log("✅ Reminder notification service started");
	}

	/**
	 * Stop the reminder notification service
	 */
	stop(): void {
		if (!this.isRunning) {
			return;
		}

		this.isRunning = false;
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		console.log("🛑 Reminder notification service stopped");
	}

	/**
	 * Check for due reminders and send notifications
	 */
	private async checkAndSendReminders(): Promise<void> {
		try {
			const activeSession = await this.sessionService.getSession(
				this.session.appName,
				this.session.userId,
				this.session.id,
			);

			if (!activeSession) {
				return;
			}
			const state = activeSession?.state as PersonalAgentState;
			const { reminders = [] } = state;

			if (reminders.length === 0) {
				return;
			}

			const now = new Date();
			const dueReminders = reminders.filter((reminder) => {
				if (!reminder.scheduledTime) {
					return false;
				}

				const scheduledTime = new Date(reminder.scheduledTime);

				// Check if the reminder is due (within the last check interval)
				const timeDiff = now.getTime() - scheduledTime.getTime();
				return timeDiff >= 0 && timeDiff < this.checkIntervalMs;
			});

			if (dueReminders.length === 0) {
				return;
			}

			console.log(`🔔 Found ${dueReminders.length} due reminder(s)`);

			// Send notifications for due reminders
			for (const reminder of dueReminders) {
				await this.sendReminderNotification(reminder);
			}

			// Remove sent reminders from the state (unless they're recurring)
			const updatedReminders = reminders
				.map((reminder) => {
					const isDue = dueReminders.some((due) => due.id === reminder.id);
					if (!isDue) {
						return reminder;
					}

					// For recurring reminders, schedule the next occurrence
					if (reminder.recurring) {
						this.scheduleNextRecurrence(reminder);
						return reminder;
					}

					// For non-recurring reminders, mark for removal
					return null;
				})
				.filter((reminder): reminder is Reminder => reminder !== null);

			// Update the session state by creating a state update event
			const updateEvent = new Event({
				author: "system",
				actions: new EventActions({
					stateDelta: {
						reminders: updatedReminders,
					},
				}),
			});

			if (activeSession)
				await this.sessionService.appendEvent(activeSession, updateEvent);
		} catch (error) {
			console.error("❌ Error in checkAndSendReminders:", error);
		}
	}

	/**
	 * Send a reminder notification via Telegram
	 */
	private async sendReminderNotification(reminder: Reminder): Promise<void> {
		try {
			const message = dedent`
				🔔 Reminder Alert!

				${reminder.text}

				Scheduled for: ${reminder.scheduledTime ? new Date(reminder.scheduledTime).toLocaleString() : "None"}
			`;

			await this.telegramRunner.ask(dedent`
				Send this reminder notification via telegram: "${message} to channel id: ${env.TELEGRAM_CHANNEL_ID}"
			`);

			console.log(`✅ Sent reminder: ${reminder.text}`);
		} catch (error) {
			console.error(`❌ Failed to send reminder: ${reminder.text}`, error);
		}
	}

	/**
	 * Schedule the next occurrence for recurring reminders
	 */
	private scheduleNextRecurrence(reminder: Reminder): boolean {
		if (!reminder.recurring || !reminder.scheduledTime) {
			return false;
		}

		const currentDate = new Date(reminder.scheduledTime);
		const { type, interval = 1 } = reminder.recurring;

		switch (type) {
			case "daily":
				currentDate.setDate(currentDate.getDate() + interval);
				break;
			case "weekly":
				currentDate.setDate(currentDate.getDate() + 7 * interval);
				break;
			case "monthly":
				currentDate.setMonth(currentDate.getMonth() + interval);
				break;
			default:
				console.warn(`Unknown recurring type: ${type}`);
				return false;
		}

		reminder.scheduledTime = currentDate.toISOString();
		console.log(
			`📅 Scheduled next occurrence for recurring reminder: ${reminder.text} at ${currentDate.toLocaleString()}`,
		);

		return true;
	}
}
