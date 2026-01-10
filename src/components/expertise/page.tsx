import styles from "./expertise.module.css";
import { expertise, otherExpertise, tools } from "@/data/expertise";
import clsx from "clsx";

export default function Expertise() {
	return (
		<section className={styles.parent}>
			<section>
				<h1 className={styles.bigTitle}>Expertise</h1>
				{expertise.map((item, index) => {
					return (
						<article key={index} className={styles.expertiseItem}>
							<div
								className={clsx(
									styles.icon,
									styles[item.animID],
								)}
							>
								{item.icon}
							</div>
							<div className={styles.contentWrapper}>
								<header className={styles.header}>
									<h2 className={styles.title}>
										{item.title}
									</h2>
								</header>
								<p className={styles.description}>
									{item.description}
								</p>
							</div>
						</article>
					);
				})}
			</section>
			<section>
				<h1 className={styles.bigTitle}>Other Expertise</h1>
				<div className={styles.otherExpertiseContainer}>
					{otherExpertise.map((item, i) => (
						<div key={i} className={styles.otherExpertiseItem}>
							{item}
						</div>
					))}
				</div>
			</section>
			<section>
				<h1 className={styles.bigTitle}>Tools</h1>
				<div className={styles.toolsContainer}>
					{tools.map((item, i) => (
						<div key={i} className={styles.toolsItem}>
							{item}
						</div>
					))}
				</div>
			</section>
		</section>
	);
}
