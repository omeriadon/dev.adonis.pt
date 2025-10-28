import styles from "./education.module.css";

type EducationPlace = {
	date: string;
	title: string;
	subtitle: string;
	description: string;
};

const educationPlaces: EducationPlace[] = [
	{
		date: "2020 - now",
		title: "Perth Modern School",
		subtitle: "High School",
		description: "Selective academic high school in WA",
	},
	{
		date: "2020 - now",
		title: "Perth Modern School",
		subtitle: "High School",
		description: "Selective academic high school in WA",
	},
	{
		date: "2020 - now",
		title: "Perth Modern School",
		subtitle: "High School",
		description: "Selective academic high school in WA",
	},
	{
		date: "2020 - now",
		title: "Perth Modern School",
		subtitle: "High School",
		description: "Selective academic high school in WA",
	},
	{
		date: "2020 - now",
		title: "Perth Modern School",
		subtitle: "High School",
		description: "Selective academic high school in WA",
	},
];

export default async function Education() {
	return (
		<div className={styles.container}>
			{educationPlaces.map((item, index) => {
				return (
					<div
						key={index}
						className={`${styles.itemCommon} ${index % 2 === 0 ? styles.itemLeft : styles.itemRight}`}
					>
						<div className={styles.dateWrapper}>
							<p
								className={`${styles.date} ${index % 2 === 0 ? styles.dateLeft : styles.dateRight}`}
							>
								{item.date}
							</p>
						</div>
						<div className={styles.innerItemCommon}>
							<div className={styles.header}>
								<p className={styles.title}>{item.title}</p>
								<p className={styles.subtitle}>{item.subtitle}</p>
							</div>
							<p className={styles.description}>{item.description}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
