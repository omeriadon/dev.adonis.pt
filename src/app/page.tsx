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
	speedReveal: 0.5,
	speedSegment: 0.6,
};

export default function Home() {
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);
	const [show4, setShow4] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setPrefersReducedMotion(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		const setters = [setShow1, setShow2, setShow3, setShow4];
		const delays = [2000, 4000, 7000, 10000];
		if (prefersReducedMotion) {
			setters.forEach((setter) => setter(true));
			return;
		}

		setters.forEach((setter) => setter(false));

		const timers = delays.map((delay, index) =>
			setTimeout(() => setters[index](true), delay),
		);

		return () => timers.forEach((timer) => clearTimeout(timer));
	}, [prefersReducedMotion]);

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
