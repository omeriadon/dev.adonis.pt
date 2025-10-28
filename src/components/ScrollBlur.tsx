"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

interface ScrollBlurProps {
	children: ReactNode;
	footerId: string;
	startBlurDistance?: number;
	endBlurDistance?: number;
}

export default function ScrollBlur({
	children,
	footerId,
	startBlurDistance = 100,
	endBlurDistance = -50,
}: ScrollBlurProps) {
	const [blur, setBlur] = useState(0);
	const [opacity, setOpacity] = useState(1);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleScroll() {
			const footer = document.getElementById(footerId);
			if (!footer || !containerRef.current) return;

			const footerTop = footer.getBoundingClientRect().top;
			const windowHeight = window.innerHeight;
			const distanceFromBottom = footerTop - windowHeight;

			let newBlur = 0;
			let newOpacity = 1;

			if (distanceFromBottom > startBlurDistance) {
				newBlur = 0;
				newOpacity = 1;
			} else if (distanceFromBottom < endBlurDistance) {
				newBlur = 10;
				newOpacity = 0.5;
			} else {
				const ratio =
					(startBlurDistance - distanceFromBottom) /
					(startBlurDistance - endBlurDistance);
				newBlur = ratio * 10;
				newOpacity = 1 - ratio * 0.5;
			}

			setBlur(newBlur);
			setOpacity(newOpacity);

			console.log("blur:", newBlur, "opacity:", newOpacity);
		}

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [footerId, startBlurDistance, endBlurDistance]);

	return (
		<div
			ref={containerRef}
			style={{ filter: `blur(${blur}px)`, opacity: opacity }}
		>
			{children}
		</div>
	);
}
