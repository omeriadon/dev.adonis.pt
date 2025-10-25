"use client";

import styles from "./Title.module.css";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Title() {
	const pathname = usePathname();

	let text = "";
	if (pathname.startsWith("/wallpapers")) text = "Wallpapers";
	else if (pathname === "/") text = "Adon Omeri";
	else text = "Error";

	const letters = text.split("");

	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.05 },
		},
	};

	const child = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="mb-12 grid place-items-start">
			<motion.p
				key={pathname}
				className={styles.title}
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{letters.map((char, i) => (
					<motion.span key={i} variants={child}>
						{char}
					</motion.span>
				))}
			</motion.p>
		</div>
	);
}
