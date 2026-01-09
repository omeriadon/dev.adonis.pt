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
			"The website you are looking at right now. Built with Next.js 15, React Server Components, and custom motion primitives.",
		date: "2025",
		technologies: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
		githubUrl: "https://github.com/omeriadon/dev.adonis.pt",
		demoUrl: "https://dev.adonis.pt",
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
		</div>
	);
}
