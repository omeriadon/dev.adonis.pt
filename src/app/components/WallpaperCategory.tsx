import styles from "./WallpaperCategory.module.css";
import Image from "next/image";

export interface CategoryProps {
	id: string;
	title: string;
	description: string;
	tags: string[];
	thumbnail: string;
	path: string;
}

export function WallpaperCategory(props: CategoryProps) {
	const isAbsolute = props.thumbnail.startsWith("/");
	const hasExt = /\.[a-zA-Z0-9]+$/.test(props.thumbnail);
	const fileName = hasExt ? props.thumbnail : `${props.thumbnail}.png`;
	const baseDir = props.path.replace(/\/index\.json$/, "");
	const thumbnailSrc = isAbsolute
		? hasExt
			? props.thumbnail
			: `${props.thumbnail}.png`
		: `${baseDir}/${fileName}`;

	return (
		<div className={styles.card}>
			<Image
				src={thumbnailSrc}
				alt={props.title}
				width={1504}
				height={1504}
				unoptimized={false}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
				className={styles.image}
			/>
			<div className={styles.cardText}>
				<p className={styles.cardTitle}>{props.title}</p>
				<p className={styles.amountCount}>4 wallpapers</p>
			</div>
		</div>
	);
}
