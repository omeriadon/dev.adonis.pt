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

	return (
		<div className="mb-12 grid place-items-start">
			<p key={pathname} className={styles.title}>
				{letters.map((char, i) => (
					<span
						key={i}
						className="title-letter"
						style={{ "--delay": `${i * 0.05}s` } as CSSProperties}
					>
						{char}
					</span>
				))}
			</p>
		</div>
	);
}
