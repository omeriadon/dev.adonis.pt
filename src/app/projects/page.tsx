import styles from "./projects.module.css";
import { Github, ExternalLink } from "lucide-react";

type Project = {
	title: string;
	description: string;
	date: string;
	technologies: string[];
	githubUrl?: string;
	demoUrl?: string;
};

const projects: Project[] = [
	{
		title: "Personal Portfolio",
		description:
			"The website you are looking at right now. A personal portfolio to showcase my projects and skills.",
		date: "2025",
		technologies: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
		githubUrl: "https://github.com/omeriadon/dev.adonis.pt",
		demoUrl: "https://dev.adonis.pt",
	},
	{
		title: "JDQC Dev Group",
		description:
			"A design organisation I'm part of that creates high-quality digital products and experiences.",
		date: "2025",
		technologies: [],
		demoUrl: "https://www.jdqc.dev/",
	},
	{
		title: "Elements",
		description:
			"A small and fast SwiftUI iPhone app that lets you navigate the periodic table and see element details.",
		date: "2026",
		technologies: ["Swift", "SwiftUI", "Apple Foundation Models"],
		githubUrl: "https://github.com/omeriadon/elements",
	},
	{
		title: "Boring Notch",
		description:
			"Not my project, but something I'm contributing to. A lovely little MacBook notch Dynamic Island utility",
		date: "2025",
		technologies: ["Swift", "SwiftUI", "AppKit"],
		githubUrl: "https://github.com/TheBoredTeam/boring.notch",
		demoUrl: "https://theboring.name/",
	},
	{
		title: "Kit",
		description:
			"Little WatchOS app that provides little utilities and complications. Slowly but surely growing.",
		date: "2026",
		technologies: ["Swift", "SwiftUI", "UIKit"],
		githubUrl: "https://github.com/omeriadon/Kit",
	},
	{
		title: "MultiClip",
		description:
			"Utility that is helpful for people who have multiple clipboard items and need to repeatedly paste them.",
		date: "2025",
		technologies: ["Swift", "SwiftUI", "AppKit"],
		githubUrl: "https://github.com/omeriadon/MultiClip",
	},
];

export default async function Projects() {
	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{projects.map((project, index) => (
					<div key={index} className={styles.card}>
						<div className={styles.header}>
							<h2 className={styles.title}>{project.title}</h2>
							<span className={styles.date}>{project.date}</span>
						</div>
						<p className={styles.description}>{project.description}</p>

						<div className={styles.footer}>
							<div className={styles.tags}>
								{project.technologies.map((tech) => (
									<span key={tech} className={styles.tag}>
										{tech}
									</span>
								))}
							</div>

							<div className={styles.links}>
								{project.githubUrl && (
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.link}
									>
										<Github size={16} />
										Code
									</a>
								)}
								{project.demoUrl && (
									<a
										href={project.demoUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.link}
									>
										<ExternalLink size={16} />
										Preview
									</a>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className={styles.endCard}>
				<h2 className={styles.endCardTitle}>
					And more random things on GitHub...
				</h2>
				<div className={styles.links}>
					<a
						href="https://github.com/omeriadon"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.link}
					>
						<Github size={16} />
						github.com/omeriadon
					</a>
				</div>
			</div>
		</div>
	);
}
