import styles from "./expertise.module.css";
import { expertise } from "@/data/expertise";
import clsx from "clsx";

export default function Expertise() {
	return (
		<div>
			<h1 className={styles.expertiseTitle}>Expertise</h1>
			{expertise.map((item, index) => {
				return (
					<article key={index} className={styles.expertiseItem}>
						<div className={clsx(styles.icon, styles[item.animID])}>
							{item.icon}
						</div>

						<div className={styles.contentWrapper}>
							<header className={styles.header}>
								<h2 className={styles.title}>{item.title}</h2>
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
