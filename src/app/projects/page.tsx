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
		<>
			<section className={styles.container}>
				<div className={styles.grid}>
					{projects.map((project, index) => (
						<article key={index} className={styles.card}>
							<header className={styles.header}>
								<h2 className={styles.title}>
									{project.title}
								</h2>
								<time className={styles.date}>
									{project.date}
								</time>
							</header>
							<p className={styles.description}>
								{project.description}
							</p>
							<footer className={styles.footer}>
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
											<Github
												size={16}
												aria-hidden="true"
											/>
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
							</footer>
						</article>
					))}
				</div>
			</section>

			<section className={styles.endCard}>
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
			</section>
		</>
	);
}
