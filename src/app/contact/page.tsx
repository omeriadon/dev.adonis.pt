import type { Metadata } from "next";
import styles from "./contact.module.css";
import { contactItems } from "@/data/contacts";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch via email, phone, or GitHub.",
};

export default async function Contact() {
	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{contactItems.map((item, index) => (
					<a
						key={index}
						href={item.href}
						target={
							item.href.startsWith("http") ? "_blank" : undefined
						}
						rel={
							item.href.startsWith("http")
								? "noopener noreferrer"
								: undefined
						}
						className={styles.card}
						aria-label={`${item.label}: ${item.value}`}
					>
						<div className={styles.content}>
							<p className={styles.label}>{item.label}</p>
							<p className={styles.value}>{item.value}</p>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
