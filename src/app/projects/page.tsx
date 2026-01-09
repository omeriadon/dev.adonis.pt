import type { Metadata } from "next";
import styles from "./projects.module.css";
import { Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"A collection of personal and professional projects showcasing various technologies and skills.",
};

export default async function Projects() {
	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{projects.map((project, index) => (
					<div key={index} className={styles.card}>
						<div className={styles.header}>
							<h2 className={styles.title}>{project.title}</h2>
							<div className={styles.date}>{project.date}</div>
						</div>
						<p className={styles.description}>
							{project.description}
						</p>

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
										aria-label={`View ${project.title} source code on GitHub`}
									>
										<Github size={16} aria-hidden="true" />
										Code
									</a>
								)}
								{project.demoUrl && (
									<a
										href={project.demoUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.link}
										aria-label={`Preview ${project.title}`}
									>
										<ExternalLink
											size={16}
											aria-hidden="true"
										/>
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
						aria-label="Visit my GitHub profile"
					>
						<Github size={16} aria-hidden="true" />
						github.com/omeriadon
					</a>
				</div>
			</div>
		</div>
	);
}
