import styles from "./WallpaperItemCard.module.css";
import Image from "next/image";
import { joinPath, buildDownloadName } from "@/lib/utils";

export interface WallpaperItemCardProps {
	name: string;
	image: string;
	path: string;
	thumbnail?: string;
}

export function WallpaperItemCard(props: WallpaperItemCardProps) {
	const baseDir = props.path?.replace(/\/index\.json$/, "") || "";

	const fullSrc = joinPath(baseDir, props.image);
	const thumbSrc = props.thumbnail
		? joinPath(baseDir, props.thumbnail)
		: fullSrc;

	const isPlaceholder = !thumbSrc;

	const downloadName = buildDownloadName(props.name, props.image);

	return (
		<a href={fullSrc} download={downloadName} className={styles.card}>
			<div className={styles.imageWrapper}>
				{!isPlaceholder ? (
					<Image
						src={thumbSrc}
						alt={props.name}
						fill
						sizes="50vw"
						priority
						fetchPriority="high"
						decoding="async"
						style={{ objectFit: "cover", objectPosition: "center" }}
						className={styles.image}
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
				<p className={styles.cardTitle}>{props.name || "\u00A0"}</p>
			</div>
		</a>
	);
}

export default WallpaperItemCard;
