import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Title from "./components/Title";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";

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
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
      (function() {
        try {
          var d = document.documentElement;
          var ls = localStorage.getItem('theme');
          var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
          var theme = (ls === 'light' || ls === 'dark') ? ls : (mql && mql.matches ? 'dark' : 'light');
          d.setAttribute('data-theme', theme);
          d.style.backgroundColor = theme === 'dark' ? '#000000' : '#FFFFFF';
        } catch (e) {}
      })();
    `,
					}}
				/>
			</head>
			<body className={`${departureMono.variable} antialiased body`}>
				<ThemeProvider>
					<Navbar />
					<div className="h-40" />
					<Title />
					<div className="min-h-screen children">{children}</div>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
