"use client";
import "./globals.css";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export default function Home() {
	return (
		<div className="homeParent">
			<TextEffect
				per="char"
				as="div"
				variants={{
					container: {
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05,
							},
						},
					},
					item: {
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					},
				}}
				className="custom-text-class"
				preset="fade"
				delay={0.5}
				trigger={true}
				onAnimationComplete={() => console.log("Animation complete")}
				onAnimationStart={() => console.log("Animation start")}
				segmentWrapperClassName="segment-wrapper"
				style={{ fontSize: "2rem" }}
				containerTransition={{ duration: 1 }}
				segmentTransition={{ duration: 0.5 }}
				speedReveal={1.5}
				speedSegment={0.8}
			>
				Student developer
			</TextEffect>

			<TextEffect
				per="char"
				as="div"
				variants={{
					container: {
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05,
							},
						},
					},
					item: {
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					},
				}}
				className="custom-text-class"
				preset="fade"
				delay={0.5}
				trigger={true}
				onAnimationComplete={() => console.log("Animation complete")}
				onAnimationStart={() => console.log("Animation start")}
				segmentWrapperClassName="segment-wrapper"
				style={{ fontSize: "2rem" }}
				containerTransition={{ duration: 1 }}
				segmentTransition={{ duration: 0.5 }}
				speedReveal={1.5}
				speedSegment={0.8}
			>
				Specializing in Swift, SwiftUI, and React
			</TextEffect>

			<TextEffect
				per="char"
				as="div"
				variants={{
					container: {
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05,
							},
						},
					},
					item: {
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0 },
					},
				}}
				className="custom-text-class"
				preset="fade"
				delay={0.5}
				trigger={true}
				onAnimationComplete={() => console.log("Animation complete")}
				onAnimationStart={() => console.log("Animation start")}
				segmentWrapperClassName="segment-wrapper"
				style={{ fontSize: "2rem" }}
				containerTransition={{ duration: 1 }}
				segmentTransition={{ duration: 0.5 }}
				speedReveal={1.5}
				speedSegment={0.8}
			>
				Building projects for personal growth and enjoyment
			</TextEffect>
		</div>
	);
}
