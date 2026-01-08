import styles from "./contact.module.css";

type ContactItem = {
	label: string;
	value: string;
	href: string;
};

const contactItems: ContactItem[] = [
	{
		label: "Email",
		value: "omeriadon@outlook.com",
		href: "mailto:omeriadon@outlook.com",
	},
	{
		label: "Phone",
		value: "0450 935 531",
		href: "tel:+61450935531",
	},
	{
		label: "GitHub",
		value: "github.com/omeriadon",
		href: "https://github.com/omeriadon",
	},
];

export default async function Contact() {
	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{contactItems.map((item, index) => (
					<a
						key={index}
						href={item.href}
						target={item.href.startsWith("http") ? "_blank" : undefined}
						rel={
							item.href.startsWith("http") ? "noopener noreferrer" : undefined
						}
						className={styles.card}
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
