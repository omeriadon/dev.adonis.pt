import SwiftIcon from "@/icons/SwiftIcon";
import ReactIcon from "@/icons/ReactIcon";
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
		animID: "swiftui-bird",
		title: "SwiftUI",
		description:
			"Learnt SwiftUI and really enjoyed its syntax, ease of use, and progressive disclosure.",
		icon: <SwiftIcon />,
	},
];
