import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./components/Navbar.css";
import Navbar from "./components/Navbar";

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
			<body className={`${departureMono.variable} antialiased`}>
				<Navbar />
				<div className="h-36">
					
				</div>
				{children}
			</body>
		</html>
	);
}
