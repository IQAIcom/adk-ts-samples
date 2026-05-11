import http from "node:http";
import "dotenv/config";
import { getRootAgent } from "./agents/agent";

const PORT = process.env.PORT ?? 3001;

async function main() {
	const { runner } = await getRootAgent();

	const server = http.createServer(async (req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");

		if (req.method === "OPTIONS") {
			res.writeHead(204);
			res.end();
			return;
		}

		if (req.method === "POST" && req.url === "/chat") {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", async () => {
				try {
					const { message } = JSON.parse(body);

					if (!message?.trim()) {
						res.writeHead(400, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ error: "message is required" }));
						return;
					}

					const response = await runner.ask(message.trim());
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ response }));
				} catch (err) {
					res.writeHead(500, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({
							error:
								err instanceof Error ? err.message : "Internal server error",
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
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
