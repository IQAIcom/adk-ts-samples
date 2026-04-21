import { Drafter } from "@/components/drafter";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="mx-auto max-w-4xl px-6 sm:px-10 pb-24">
				<Hero />
				<Drafter />
			</main>
		</>
	);
}
