import type { Metadata } from "next";
import styles from "./education.module.css";
import { educationEntries } from "@/data/education";

export const metadata: Metadata = {
	title: "Education",
	description: "Educational background and academic history.",
};

export default async function Education() {
	return (
		<main className={styles.container}>
			{educationEntries.map((item, index) => {
				return (
					<article
						key={index}
						className={`${styles.itemCommon} ${
							index % 2 === 0 ? styles.itemLeft : styles.itemRight
						}`}
					>
						<div className={styles.innerItemCommon}>
							<header className={styles.header}>
								<h2 className={styles.title}>{item.title}</h2>

								<div className={styles.meta}>
									<time className={styles.date}>
										{item.date}
									</time>
									<p className={styles.subtitle}>
										{item.subtitle}
									</p>
								</div>
							</header>
							<p className={styles.description}>
								{item.description}
							</p>
						</div>
					</article>
				);
			})}
		</main>
	);
}
