import http from "node:http";
import "dotenv/config";
import { getRootAgent } from "./agents/agent";

const PORT = process.env.PORT ?? 3001;
const BODY_SIZE_LIMIT = 1e6; // 1 MB

const server = http.createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const pathname = new URL(req.url ?? "", "http://localhost").pathname;

	if (req.method === "POST" && pathname === "/chat") {
		let body = "";
		let aborted = false;

		req.on("data", (chunk) => {
			body += chunk;
			if (body.length > BODY_SIZE_LIMIT) {
				aborted = true;
				res.writeHead(413, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ error: "Payload too large" }));
				req.destroy();
			}
		});

		req.on("end", async () => {
			if (aborted) return;
			try {
				const { message } = JSON.parse(body);

				if (!message?.trim()) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "message is required" }));
					return;
				}

				// Each request gets its own runner so session state (e.g. escalated flag)
				// is isolated per conversation rather than shared across all users.
				const { runner } = await getRootAgent();
				const response = await runner.ask(message.trim());
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ response }));
			} catch (err) {
				const isJsonError = err instanceof SyntaxError;
				res.writeHead(isJsonError ? 400 : 500, {
					"Content-Type": "application/json",
				});
				res.end(
					JSON.stringify({
						error: isJsonError
							? "Invalid JSON payload"
							: err instanceof Error
								? err.message
								: "Internal server error",
					}),
				);
			}
		});
		return;
	}

	res.writeHead(404);
	res.end();
});

server.listen(PORT, () => {
	console.log(`API server → http://localhost:${PORT}`);
	console.log('Run "pnpm dev" to start both server and UI together.');
});

server.on("error", (err) => {
	console.error("Fatal server error:", err);
	process.exit(1);
});
