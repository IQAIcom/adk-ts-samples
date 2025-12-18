import getCryptoTaxAgent from "./agents/crypto-tax-agent/agent.js";

async function main() {
	console.log("🚀 Starting Crypto Tax Agent...\n");

	const { runner } = await getCryptoTaxAgent();

	try {
		const userInput1 =
			"Hi! I need help calculating my crypto taxes for July-Nov 2025";
		console.log(`👤 User: ${userInput1}`);
		const greeting = await runner.ask(userInput1);
		console.log(`🤖 Agent: ${greeting}\n`);

		const userInput2 = `My wallet address is 0x1dfC530A9B3955d62D16359110E3cf385d47b1a9 on base chain, fetch my transcations`;
		console.log(`👤 User: ${userInput2}`);
		const fetchResult = await runner.ask(userInput2);
		console.log(`🤖 Agent: ${fetchResult}\n`);

		const userInput3 =
			"Great! Now please classify these transactions on fraxtal chain";
		console.log(`👤 User: ${userInput3}`);
		const classifyResult = await runner.ask(userInput3);
		console.log(`🤖 Agent: ${classifyResult}\n`);

		const userInput4 = "Calculate the cost basis using FIFO method";
		console.log(`👤 User: ${userInput4}`);
		const calculateResult = await runner.ask(userInput4);
		console.log(`🤖 Agent: ${calculateResult}\n`);

		const userInput5 = "Generate a summary report showing my capital gains.";
		console.log(`👤 User: ${userInput5}`);
		const reportResult = await runner.ask(userInput5);
		console.log(`🤖 Agent: ${reportResult}\n`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

main().catch(console.error);

export { getCryptoTaxAgent };
export default main;
