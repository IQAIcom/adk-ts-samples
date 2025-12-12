import getCryptoTaxAgent from "./agents/crypto-tax-agent/agent.js";

async function main() {
	console.log("🚀 Starting Crypto Tax Agent...\n");

	const { runner } = await getCryptoTaxAgent();

	try {
		const greeting = await runner.ask(
			"Hi! I need help calculating my crypto taxes for July-Nov 2025",
		);
		console.log(`\n${greeting}\n`);

		const fetchResult = await runner.ask(`
			My wallet address is 0x98c41750f292ac7730f50ea8e9f24dd0cfed2957 on fraxtal chain, fetch my transcations
		`);
		console.log(`\n${fetchResult}\n`);

		const classifyResult = await runner.ask(
			"Great! Now please classify these transactions on fraxtal chain",
		);
		console.log(`\n${classifyResult}\n`);

		const calculateResult = await runner.ask(
			"Calculate the cost basis using FIFO method",
		);
		console.log(`\n${calculateResult}\n`);

		const reportResult = await runner.ask(
			"Generate a summary report showing my capital gains.",
		);
		console.log(`\n${reportResult}\n`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

main().catch(console.error);

export { getCryptoTaxAgent };
export default main;
