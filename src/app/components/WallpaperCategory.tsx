import styles from "./WallpaperCategory.module.css";
import Image from "next/image";
import Link from "next/link";

export interface CategoryProps {
	id: string;
	title: string;
	description: string;
	tags: string[];
	thumbnail: string;
	path: string;
}

export function WallpaperCategory(props: CategoryProps) {
	const isPlaceholder = !props.thumbnail;
	const isAbsolute = props.thumbnail?.startsWith("/");
	const hasExt = /\.[a-zA-Z0-9]+$/.test(props.thumbnail || "");
	const fileName = hasExt ? props.thumbnail : `${props.thumbnail}.png`;
	const baseDir = props.path?.replace(/\/index\.json$/, "") || "";
	const thumbnailSrc = isAbsolute
		? hasExt
			? props.thumbnail
			: `${props.thumbnail}.png`
		: `${baseDir}/${fileName}`;

	return (
		<Link href={`/wallpapers/${props.id}`} className={styles.card}>
			<div className={styles.imageWrapper}>
				{!isPlaceholder ? (
					<Image
						src={thumbnailSrc}
						alt={props.title}
						fill
						sizes="50vw"
						priority
						fetchPriority="high"
						decoding="async"
						style={{ objectFit: "cover", objectPosition: "center" }}
						className={`${styles.image} noSelect`}
						draggable={false}
					/>
				) : (
					<div
						className={styles.placeholder}
						style={{ backgroundPosition: "center" }}
					/>
				)}
			</div>
			<div className={styles.cardText}>
				<p className={styles.cardTitle}>{props.title || "\u00A0"}</p>
				<p className={styles.amountCount}>
					{props.description ?? ""}
				</p>
			</div>
		</Link>
	);
}
