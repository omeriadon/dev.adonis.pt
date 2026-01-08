import type { Metadata } from "next";
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
	title: "Adon Omeri",
	description: "",
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
      /* Page transition animations */
      @keyframes fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      ::view-transition-old(page-content) {
        animation: fade-out 0.2s ease-out forwards;
      }
      
      ::view-transition-new(page-content) {
        animation: fade-in 0.25s ease-in 0.15s forwards;
        opacity: 0;
      }
      
      /* Prevent any elements from creating their own view transition names */
      a, img, button {
        view-transition-name: none !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(page-content),
        ::view-transition-new(page-content) {
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
					<ScrollBlur footerId="footer">
						<ViewTransition>
							<div
								className="min-h-screen children"
								style={{ viewTransitionName: "page-content" }}
							>
								{children}
							</div>
						</ViewTransition>
					</ScrollBlur>
					<Footer id="footer" />
				</ThemeProvider>
			</body>
		</html>
	);
}
