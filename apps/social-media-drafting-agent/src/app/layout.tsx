import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	style: ["normal", "italic"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "The Draft Desk — ADK-TS",
	description:
		"A starter template for building AI agents with ADK-TS and Next.js",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} bg-paper text-ink`}
			>
				{children}
			</body>
		</html>
	);
}
