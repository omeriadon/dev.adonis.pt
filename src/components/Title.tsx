"use client";
import styles from "./Title.module.css";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { routeTitles } from "@/data/navigation";

function slugToTitle(slug: string): string {
	return slug
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function Title() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const segments = pathname.split("/").filter(Boolean);

	const isDetailPage = segments.length >= 2;
	const detailId = isDetailPage ? segments[segments.length - 1] : null;

	let text = "";
	if (isDetailPage && detailId) {
		text = slugToTitle(detailId);
	} else {
		const basePath = `/${segments[0] ?? ""}`.replace(/\/$/, "") || "/";
		text = routeTitles[basePath] ?? `${pathname} ?`;
	}

	const mainLetters = text.split("");
	const totalLetters = mainLetters.length;
	const letterDelay = isHome ? 0.05 : 0.03;
	const glowFadeDelay = (totalLetters - 1) * letterDelay + 0.4 + 0.2;
	const hasQuestion = text.endsWith("?");

	return (
		<header className="grid place-items-center">
			<div className={styles.titleWrap}>
				<h1 className="sr-only">{text}</h1>
				<p
					key={pathname + "-glow"}
					aria-hidden="true"
					className={`${styles.title} ${isHome ? styles.homeTitle : ""} ${
						styles.glowLayer
					}`}
					style={
						{
							"--glow-fade-delay": `${glowFadeDelay}s`,
						} as CSSProperties
					}
				>
					{mainLetters.map((char, i) => (
						<span
							key={`g-${i}`}
							className={styles.glowLetter}
							aria-hidden="true"
							style={
								{
									"--delay": `${i * letterDelay}s`,
								} as CSSProperties
							}
						>
							{char}
						</span>
					))}
				</p>
				<p
					key={pathname + "-main"}
					className={`${styles.title} ${isHome ? styles.homeTitle : ""} ${
						styles.mainLayer
					}`}
				>
					{mainLetters.map((char, i) => (
						<span
							key={`m-${i}`}
							className={`title-letter ${
								hasQuestion && char === "?"
									? styles.blinkQuestion
									: ""
							}`}
							style={
								{
									"--delay": `${i * letterDelay}s`,
								} as CSSProperties
							}
						>
							{char}
						</span>
					))}
				</p>
			</div>
		</header>
	);
}
