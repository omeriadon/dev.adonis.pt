import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

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
				<script
					dangerouslySetInnerHTML={{
						__html: `
      (function () {
        try {
          var KEY = 'session-intro-shown';
          var isHome = (location && location.pathname === '/');
          var seen = sessionStorage.getItem(KEY);
          if (!seen) {
            if (isHome) {
              document.documentElement.setAttribute('data-intro', 'true');
              try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
              // Remove the attribute after the animation window passes.
              // Start delay: 15000ms, duration: 2000ms -> 17000ms total.
              setTimeout(function () {
                document.documentElement.removeAttribute('data-intro');
              }, 17500);
            } else {
              // First page of the session is not home; lock out intro for this session.
              try { sessionStorage.setItem(KEY, 'locked'); } catch (e) {}
            }
          }
        } catch (e) {}
      })();
    `,
					}}
				/>
				<style
					dangerouslySetInnerHTML={{
						__html: `
      /* Session intro fade styles:
         - Only affect chrome (nav, footer, title, spacer), not the page content (.children)
         - Only runs when html[data-intro="true"] is present (first page of the session AND home page)
         - Start 15s after load, take 2s, ease-in-out
         - Respect reduced motion
      */
      @media (prefers-reduced-motion: no-preference) {
        html[data-intro="true"] body nav,
        html[data-intro="true"] body footer,
        html[data-intro="true"] body .spacer,
        html[data-intro="true"] body .title-fade {
          opacity: 0;
          pointer-events: none;
          will-change: opacity;
          animation: firstVisitFadeIn 2s ease-in-out 15s forwards;
        }
      }

      @keyframes firstVisitFadeIn {
        from { opacity: 0; pointer-events: none; }
        to { opacity: 1; pointer-events: auto; }
      }
    `,
					}}
				/>
			</head>
			<body className={`${departureMono.variable} antialiased body`}>
				<ThemeProvider>
					<Navbar />
					<div className="spacer" />
					<Title />
					<div className="min-h-screen children">{children}</div>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
