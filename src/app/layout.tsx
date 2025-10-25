import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Title from "./components/Title";
import Footer from "./components/Footer";

const departureMono = localFont({
	src: [
		{
			path: "../../public/fonts/DepartureMono.otf",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Adon Omeri",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${departureMono.variable} antialiased px-20`}>
				<Navbar />
				<div className="h-40" />
				<Title />
				<div className="min-h-screen">{children}</div>
				<Footer />
			</body>
		</html>
	);
}
