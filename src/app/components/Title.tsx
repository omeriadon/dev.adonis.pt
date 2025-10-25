"use client";

import styles from "./Title.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

export default function Title() {
	const pathname = usePathname();

	// Detect if we're on a wallpapers detail page: /wallpapers/[id]
	const segments = pathname.split("/").filter(Boolean);
	const wallpapersId =
		segments.length >= 2 && segments[0] === "wallpapers" ? segments[1] : null;

	// Title of the current category from the root index.json (id -> title mapping)
	const [categoryTitle, setCategoryTitle] = useState<string>("");

	useEffect(() => {
		let cancelled = false;
		async function loadTitle() {
			if (!wallpapersId) {
				setCategoryTitle("");
				return;
			}
			try {
				const res = await fetch("/wallpapers/index.json", {
					cache: "no-cache",
				});
				if (!res.ok) return;
				const data = await res.json();
				const list = Array.isArray(data) ? data : [];
				const match = list.find((c: any) => c?.id === wallpapersId);
				if (!cancelled) {
					setCategoryTitle(match?.title || "");
				}
			} catch {
				// ignore; keep empty so we don't show a guessed title
			}
		}
		loadTitle();
		return () => {
			cancelled = true;
		};
	}, [wallpapersId]);

	// Build title content
	let isDetail = Boolean(wallpapersId);
	let text = "";
	if (!isDetail) {
		if (pathname.startsWith("/wallpapers")) text = "Wallpapers";
		else if (pathname === "/") text = "Adon Omeri";
		else text = pathname + " ?";
	}

	// For detail pages: "Wallpapers / " in half opacity + actual category title
	const prefixText = isDetail ? "Wallpapers /" : "";
	const mainText = isDetail ? categoryTitle : text;

	const prefixLetters = prefixText.split("");
	const mainLetters = mainText.split("");

	const totalLetters = prefixLetters.length + mainLetters.length;
	const glowFadeDelay = (totalLetters - 1) * 0.05 + 0.4 + 0.2;

	const hasQuestion = !isDetail && text.endsWith("?");

	return (
		<div className="mb-12 grid place-items-center">
			<div className={styles.titleWrap}>
				{/* Glow layer */}
				<p
					key={pathname + "-glow"}
					aria-hidden="true"
					className={`${styles.title} ${styles.glowLayer}`}
					style={{ "--glow-fade-delay": `${glowFadeDelay}s` } as CSSProperties}
				>
					{isDetail ? (
						<>
							<span style={{ opacity: 0.5 }}>
								{prefixLetters.map((char, i) => (
									<span
										key={`g-pre-${i}`}
										className={styles.glowLetter}
										style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
									>
										{char}
									</span>
								))}
							</span>{" "}
							<wbr />
							{mainLetters.map((char, i) => (
								<span
									key={`g-main-${i}`}
									className={styles.glowLetter}
									style={
										{
											"--delay": `${(prefixLetters.length + i) * 0.05}s`,
										} as CSSProperties
									}
								>
									{char}
								</span>
							))}
						</>
					) : (
						mainLetters.map((char, i) => (
							<span
								key={`g-${i}`}
								className={styles.glowLetter}
								style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
							>
								{char}
							</span>
						))
					)}
				</p>

				{/* Main layer */}
				<p
					key={pathname + "-main"}
					className={`${styles.title} ${styles.mainLayer}`}
				>
					{isDetail ? (
						<>
							<span style={{ opacity: 0.5 }}>
								{prefixLetters.map((char, i) => (
									<span
										key={`m-pre-${i}`}
										className="title-letter"
										style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
									>
										{char}
									</span>
								))}
							</span>{" "}
							<wbr />
							{mainLetters.map((char, i) => (
								<span
									key={`m-main-${i}`}
									className="title-letter"
									style={
										{
											"--delay": `${(prefixLetters.length + i) * 0.05}s`,
										} as CSSProperties
									}
								>
									{char}
								</span>
							))}
						</>
					) : (
						mainLetters.map((char, i) => (
							<span
								key={`m-${i}`}
								className={`title-letter ${hasQuestion && char === "?" ? styles.blinkQuestion : ""}`}
								style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
							>
								{char}
							</span>
						))
					)}
				</p>
			</div>
		</div>
	);
}
