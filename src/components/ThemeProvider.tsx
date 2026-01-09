"use client";
import {
	useInsertionEffect,
	ReactNode,
	createContext,
	useContext,
	useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = "theme";
const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
	return ctx;
}

function getServerSnapshot(): Theme {
	return "dark";
}

function subscribe(callback: () => void) {
	if (typeof window === "undefined") return () => {};

	const storageHandler = (e: StorageEvent) => {
		if (e.key === THEME_STORAGE_KEY) callback();
	};
	window.addEventListener("storage", storageHandler);

	const mql = window.matchMedia?.(PREFERS_DARK_QUERY);
	if (mql?.addEventListener) {
		mql.addEventListener("change", callback);
	}

	return () => {
		window.removeEventListener("storage", storageHandler);
		if (mql?.removeEventListener) {
			mql.removeEventListener("change", callback);
		}
	};
}

function getSnapshot(): Theme {
	if (typeof window === "undefined") return "dark";
	const preset = document.documentElement.getAttribute("data-theme");
	if (preset === "dark" || preset === "light") return preset as Theme;
	const saved = localStorage.getItem(THEME_STORAGE_KEY);
	if (saved === "dark" || saved === "light") return saved as Theme;
	return window.matchMedia?.(PREFERS_DARK_QUERY).matches ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	useInsertionEffect(() => {
		applyThemeToDOM(theme);
	}, [theme]);

	const toggleTheme = () => {
		const next = theme === "dark" ? "light" : "dark";
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {}
		applyThemeToDOM(next);
		window.dispatchEvent(
			new StorageEvent("storage", { key: THEME_STORAGE_KEY }),
		);
	};

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
