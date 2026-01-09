import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { ViewTransition } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollBlur from "@/components/ScrollBlur";

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
	title: {
		default: "Adon Omeri",
		template: "%s | Adon Omeri",
	},
	description:
		"Personal portfolio showcasing projects, certificates, education, and wallpapers.",
	keywords: [
		"portfolio",
		"developer",
		"projects",
		"certificates",
		"wallpapers",
	],
	authors: [{ name: "Adon Omeri" }],
	creator: "Adon Omeri",
	metadataBase: new URL("https://dev.adonis.pt"),
	openGraph: {
		type: "website",
		locale: "en_AU",
		siteName: "Adon Omeri",
		title: "Adon Omeri",
		description:
			"Personal portfolio showcasing projects, certificates, education, and wallpapers.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Adon Omeri",
		description:
			"Personal portfolio showcasing projects, certificates, education, and wallpapers.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			data-theme="dark"
			style={{ backgroundColor: "#000000" }}
		>
			<head>
				<meta
					name="google-site-verification"
					content="X2bAXHgbZf-Kk2SSxeGgnruHFQCXB0dtTOvct-mve-A"
				/>
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
          d.style.colorScheme = theme;
          if (theme === 'dark') {
            d.classList.add('dark');
          } else {
            d.classList.remove('dark');
          }
        } catch (e) {}
      })();
    `,
					}}
				/>
				<style
					dangerouslySetInnerHTML={{
						__html: `
      ::view-transition-group(.fade-page) {
        animation-duration: 0s;
      }

      ::view-transition-old(.fade-page) {
        animation: fade-out 0.2s ease-out forwards;
        mix-blend-mode: normal;
      }
      
      ::view-transition-new(.fade-page) {
        animation: fade-in 0.25s ease-in forwards;
        mix-blend-mode: normal;
      }
      
      /* Prevent any elements from creating their own view transition names */
      a, img, button {
        view-transition-name: none !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(.fade-page),
        ::view-transition-new(.fade-page) {
          animation: none;
        }
      }
    `,
					}}
				/>
			</head>
			<body className={`${departureMono.variable} antialiased body`}>
				<ThemeProvider>
					<ScrollToTop />
					<Navbar />
					<div className="spacer" />
					<Title />
					<ScrollBlur>
						<ViewTransition default="fade-page">
							<main className="min-h-screen children">
								{children}
							</main>
						</ViewTransition>
					</ScrollBlur>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
