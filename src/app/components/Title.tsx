"use client";

import styles from "./Title.module.css";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

export default function Title() {
	const pathname = usePathname();

	let text = "";
	if (pathname.startsWith("/wallpapers")) text = "Wallpapers";
	else if (pathname === "/") text = "Adon Omeri";
	else text = pathname + " ?";

	const letters = text.split("");
	const glowFadeDelay = (letters.length - 1) * 0.05 + 0.4 + 0.2;
	const hasQuestion = text.endsWith("?");

	return (
		<div className="mb-12 grid place-items-start">
			<div className={styles.titleWrap}>
				<p
					key={pathname + "-glow"}
					aria-hidden="true"
					className={`${styles.title} ${styles.glowLayer}`}
					style={{ "--glow-fade-delay": `${glowFadeDelay}s` } as CSSProperties}
				>
					{letters.map((char, i) => (
						<span
							key={i}
							className={styles.glowLetter}
							style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
						>
							{char}
						</span>
					))}
				</p>

				<p
					key={pathname + "-main"}
					className={`${styles.title} ${styles.mainLayer}`}
				>
					{letters.map((char, i) => (
						<span
							key={i}
							className={`title-letter ${hasQuestion && char === "?" ? styles.blinkQuestion : ""}`}
							style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
						>
							{char}
						</span>
					))}
				</p>
			</div>
		</div>
	);
}
