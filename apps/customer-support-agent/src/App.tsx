import { type FormEvent, useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	role: "user" | "agent";
	text: string;
}

const EXAMPLES = [
	"What is your return policy?",
	"How much does shipping cost?",
	"Can I return opened skin care products?",
	"Where is my order? My order number is 3",
	"Look up my account, my user ID is 1",
	"I need to speak to a human agent",
];

export default function App() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: crypto.randomUUID(),
			role: "agent",
			text: "Hi! I'm the Acme Corp support agent. How can I help you today?",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messages.length > 0 || loading) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, loading]);

	async function send(text: string) {
		if (!text.trim() || loading) return;

		setMessages((prev) => [
			...prev,
			{ id: crypto.randomUUID(), role: "user", text },
		]);
		setInput("");
		setLoading(true);

		try {
			const res = await fetch("/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: text }),
			});
			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					role: "agent",
					text: data.response ?? data.error ?? "Something went wrong.",
				},
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					role: "agent",
					text: "Connection error. Is the server running?",
				},
			]);
		} finally {
			setLoading(false);
		}
	}

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		send(input);
	}

	const showExamples = messages.length === 1;

	return (
		<div className="app">
			<header className="header">
				<div className="header-dot" />
				<span>Acme Corp Support</span>
			</header>

			<div className="messages">
				{messages.map((m) => (
					<div key={m.id} className={`message ${m.role}`}>
						<div className="bubble">{m.text}</div>
					</div>
				))}

				{loading && (
					<div className="message agent">
						<div className="bubble typing">
							<span />
							<span />
							<span />
						</div>
					</div>
				)}

				<div ref={bottomRef} />
			</div>

			{showExamples && (
				<div className="examples">
					{EXAMPLES.map((ex) => (
						<button
							key={ex}
							className="example-btn"
							onClick={() => send(ex)}
							type="button"
						>
							{ex}
						</button>
					))}
				</div>
			)}

			<form className="input-area" onSubmit={onSubmit}>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					disabled={loading}
				/>
				<button type="submit" disabled={loading || !input.trim()}>
					Send
				</button>
			</form>
		</div>
	);
}
