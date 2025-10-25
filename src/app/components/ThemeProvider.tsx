"use client";
import {
	useState,
	useEffect,
	ReactNode,
	createContext,
	useContext,
} from "react";

type Theme = "dark" | "light";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
	return ctx;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		const initial = getPreferredTheme();
		setTheme(initial);
		applyThemeToDOM(initial);

		if (
			!localStorage.getItem("theme") &&
			typeof window !== "undefined" &&
			window.matchMedia
		) {
			const mql = window.matchMedia("(prefers-color-scheme: dark)");
			const handler = (e: MediaQueryListEvent) => {
				const sysTheme: Theme = e.matches ? "dark" : "light";
				setTheme(sysTheme);
				applyThemeToDOM(sysTheme);
			};
			if (mql.addEventListener) {
				mql.addEventListener("change", handler);
				return () => mql.removeEventListener("change", handler);
			} else {
				mql.addListener(handler);
				return () => mql.removeListener(handler);
			}
		}
	}, []);

	useEffect(() => {
		applyThemeToDOM(theme);
		try {
			localStorage.setItem("theme", theme);
		} catch {}
	}, [theme]);

	const toggleTheme = () =>
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			applyThemeToDOM(next);
			try {
				localStorage.setItem("theme", next);
			} catch {}
			return next;
		});

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

function applyThemeToDOM(theme: Theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.setAttribute("data-theme", theme);
	root.style.colorScheme = theme;
	root.style.backgroundColor = theme === "dark" ? "#000000" : "#FFFFFF";
	if (theme === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
}

function getPreferredTheme(): Theme {
	if (typeof window === "undefined") return "dark";
	const saved = localStorage.getItem("theme");
	if (saved === "dark" || saved === "light") return saved as Theme;
	return window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}
