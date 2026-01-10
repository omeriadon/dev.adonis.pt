import styles from "./journey.module.css";
import { journeyItems } from "@/data/journeys";
import clsx from "clsx";

export default function Journey() {
	return (
		<div>
			<h1 className={styles.journeyTitle}>My journey so far</h1>
			{journeyItems.map((item, index) => {
				return (
					<article key={index} className={styles.journeyItem}>
						<div className={clsx(styles.icon, styles[item.animID])}>
							{item.icon}
						</div>

						<div className={styles.contentWrapper}>
							<header className={styles.header}>
								<h2 className={styles.title}>{item.title}</h2>
								<time className={styles.date}>{item.date}</time>
							</header>
							<p className={styles.description}>
								{item.description}
							</p>
						</div>
					</article>
				);
			})}
		</div>
	);
}
