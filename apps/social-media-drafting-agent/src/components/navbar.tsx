import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
	return (
		<nav className="border-b border-rule bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="mx-auto max-w-4xl px-6 sm:px-10 py-5 flex items-center justify-between">
				<Link href="/" className="flex items-baseline gap-3 group">
					<Image
						src="/dark-adk.png"
						alt="ADK-TS"
						width={22}
						height={22}
						className="self-center"
					/>
					<span className="font-display text-xl leading-none tracking-tight">
						The Draft Desk
					</span>
				</Link>
				<Link
					href="https://adk.iqai.com/docs/framework/get-started"
					target="_blank"
					rel="noopener noreferrer"
					className="text-[11px] uppercase tracking-[0.22em] text-ink hover:text-accent underline underline-offset-4 decoration-rule-strong hover:decoration-accent transition-colors"
				>
					Get started →
				</Link>
			</div>
		</nav>
	);
};
