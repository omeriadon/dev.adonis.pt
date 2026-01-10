"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./Footer.module.css";
import { type HTMLAttributes, useEffect, useState } from "react";

const GITHUB_COMMITS_URL =
	"https://api.github.com/repos/omeriadon/dev.adonis.pt/commits?per_page=1";

type GithubCommitResponse = {
	commit?: {
		author?: {
			date?: string;
		};
	};
};

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
	numeric: "auto",
});

function formatRelativeTime(dateString: string) {
	const target = new Date(dateString).getTime();
	if (Number.isNaN(target)) return "unknown time";
	const deltaSeconds = Math.round((Date.now() - target) / 1000);
	const intervals = [
		{ unit: "year" as const, seconds: 31536000 },
		{ unit: "month" as const, seconds: 2592000 },
		{ unit: "week" as const, seconds: 604800 },
		{ unit: "day" as const, seconds: 86400 },
		{ unit: "hour" as const, seconds: 3600 },
		{ unit: "minute" as const, seconds: 60 },
		{ unit: "second" as const, seconds: 1 },
	];

	for (const { unit, seconds } of intervals) {
		if (Math.abs(deltaSeconds) >= seconds || unit === "second") {
			const value = Math.max(1, Math.round(deltaSeconds / seconds));
			return relativeFormatter.format(-value, unit);
		}
	}

	return "just now";
}

function formatCommitDate(dateString: string) {
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return null;
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function Footer(props: HTMLAttributes<HTMLElement>) {
	const { theme, toggleTheme } = useTheme();
	const [lastUpdatedLabel, setLastUpdatedLabel] = useState(
		"Checking latest commit...",
	);
	const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

	const colors = [
		"#d59d41",
		"#3d1909",
		"#753888",
		"#d0dfe0",
		"#da3d46",
		"#63d6a1",
		"#e89163",
		"#455b82",
		"#101a8d",
		"#000000",
		"#332923",
		"#323332",
		"#b79f72",
	];

	useEffect(() => {
		let active = true;
		fetch(GITHUB_COMMITS_URL, {
			cache: "no-store",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Unable to fetch commits");
				}
				return response.json() as Promise<GithubCommitResponse[]>;
			})
			.then((entries) => {
				if (!active) return;
				const latest = Array.isArray(entries) ? entries[0] : undefined;
				const rawDate = latest?.commit?.author?.date;
				if (rawDate) {
					setLastUpdatedLabel(formatRelativeTime(rawDate));
					setLastUpdatedDate(formatCommitDate(rawDate));
					return;
				}
				setLastUpdatedLabel("Commit timestamp unavailable");
			})
			.catch(() => {
				if (!active) return;
				setLastUpdatedLabel("Could not fetch latest commit");
			});
		return () => {
			active = false;
		};
	}, []);

	return (
		<footer
			id="footerId"
			className={styles.footer}
			role="contentinfo"
			{...props}
		>
			<div className={styles.innerContent}>
				<div className={styles.leftBlock}>
					<p className="noSelect">Adon Omeri</p>
				</div>
				<div className={styles.rightBlock}>
					<button
						type="button"
						onClick={toggleTheme}
						title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
						aria-pressed={theme === "dark"}
						aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
					>
						Switch theme: {theme}
					</button>
				</div>
			</div>
			<div
				className={styles.colorBand}
				aria-hidden="true"
				role="presentation"
			>
				{colors.map((color, i) => (
					<div
						key={i}
						className={styles.colorStripe}
						style={{ backgroundColor: color }}
						aria-hidden="true"
						suppressHydrationWarning
					/>
				))}
			</div>
		</footer>
	);
}
