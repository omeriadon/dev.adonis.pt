import styles from "./WallpaperItemCard.module.css";
import Image from "next/image";

export interface WallpaperItemCardProps {
	name: string;
	image: string;
	path: string;
	thumbnail?: string;
}

function toFileName(maybeFile: string): string {
	const hasExt = /\.[a-zA-Z0-9]+$/.test(maybeFile || "");
	return hasExt ? maybeFile : `${maybeFile}.png`;
}

function joinPath(baseDir: string, file: string): string {
	if (!file) return "";
	if (file.startsWith("/")) return file;
	const hasExt = /\.[a-zA-Z0-9]+$/.test(file || "");
	const rel = hasExt ? file : `${file}.png`;
	return `${baseDir}/${rel}`;
}

function slugify(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function WallpaperItemCard(props: WallpaperItemCardProps) {
	const baseDir = props.path?.replace(/\/index\.json$/, "") || "";

	const fullSrc = joinPath(baseDir, props.image);
	const thumbSrc = props.thumbnail
		? joinPath(baseDir, props.thumbnail)
		: fullSrc;

	const isPlaceholder = !thumbSrc;

	const ext =
		(toFileName(props.image).match(/\.[a-zA-Z0-9]+$/)?.[0] as
			| string
			| undefined) || ".png";
	const fallbackBase =
		toFileName(props.image)
			.split("/")
			.pop()
			?.replace(/\.[^.]+$/, "") || "wallpaper";
	const downloadBase = props.name ? slugify(props.name) : slugify(fallbackBase);
	const downloadName = `${downloadBase || "wallpaper"}${ext}`;

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
