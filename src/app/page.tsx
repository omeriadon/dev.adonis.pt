"use client";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Home.module.css";

const text1 = "Student developer.";
const text2 = "Specializing in Swift, SwiftUI, and React.";
const text3 = "Building projects for personal growth and enjoyment.";

const sharedProps = {
	per: "char" as const,
	preset: "fade" as const,
	delay: 0.5,
	trigger: true,
	containerTransition: { duration: 1 },
	segmentTransition: { duration: 0.2 },
	speedReveal: 0.3,
	speedSegment: 0.6,
};

export default function Home() {
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);

	useEffect(() => {
		const t1 = setTimeout(() => setShow1(true), 2000);
		const t2 = setTimeout(() => setShow2(true), 5000);
		const t3 = setTimeout(() => setShow3(true), 10000);
		const t4 = setTimeout(() => setShow4(true), 17000);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	}, []);

	return (
		<div className={styles.homeParent}>
			{show1 && (
				<TextEffect {...sharedProps} className={styles.homeSubtitle}>
					{text1}
				</TextEffect>
			)}
			{show2 && (
				<TextEffect {...sharedProps} className={styles.homeSubtitle}>
					{text2}
				</TextEffect>
			)}
			{show3 && (
				<TextEffect {...sharedProps} className={styles.homeSubtitle}>
					{text3}
				</TextEffect>
			)}
			{show4 && (
				<div className={styles.homeButtonsGrid}>
					<Link href="/projects" className={styles.homeButton}>
						View Projects
					</Link>
					<Link href="/contact" className={styles.homeButton}>
						Contact
					</Link>
				</div>
			)}
		</div>
	);
}
