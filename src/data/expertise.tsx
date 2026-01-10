import SwiftIcon from "@/icons/SwiftIcon";
import ReactIcon from "@/icons/ReactIcon";
import TailwindIcon from "@/icons/TailwindIcon";
import { ExpertiseItem } from "../types";

export const expertise: ExpertiseItem[] = [
	{
		animID: "react",
		title: "React",
		description:
			"Combined with Next.js and Tailwind, the stack I always use for web apps.",
		icon: <ReactIcon />,
	},
	{
		animID: "tailwind",
		title: "Tailwind CSS",
		description:
			"Lots of nice utilities, even if I don't like inline css everywhere.",
		icon: <TailwindIcon />,
	},
	{
		animID: "swiftui-bird",
		title: "SwiftUI",
		description:
			"Learnt SwiftUI and really enjoyed its syntax, ease of use, and progressive disclosure.",
		icon: <SwiftIcon />,
	},
];

export const otherExpertise: string[] = ["Git", "GitHub", "Framer Motion"];

export const tools: string[] = ["VS Code", "Zed", "Xcode"];
