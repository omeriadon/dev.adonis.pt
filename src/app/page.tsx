"use client";
import "./globals.css";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { useState, useEffect } from "react";

const text1 = "Student developer.";
const text2 = "Specializing in Swift, SwiftUI, and React.";
const text3 = "Building projects for personal growth and enjoyment.";

const sharedProps = {
	per: "char" as const,
	preset: "fade" as const,
	delay: 0.5,
	trigger: true,
	style: { fontSize: "2rem" },
	containerTransition: { duration: 1 },
	segmentTransition: { duration: 0.2 },
	speedReveal: 0.3,
	speedSegment: 0.6,
};

export default function Home() {
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);

	useEffect(() => {
		setTimeout(() => setShow1(true), 2000);
		setTimeout(() => setShow2(true), 5000);
		setTimeout(() => setShow3(true), 10000);
	}, []);

	return (
		<div className="homeParent">
			{show1 && <TextEffect {...sharedProps}>{text1}</TextEffect>}
			{show2 && <TextEffect {...sharedProps}>{text2}</TextEffect>}
			{show3 && <TextEffect {...sharedProps}>{text3}</TextEffect>}
		</div>
	);
}
