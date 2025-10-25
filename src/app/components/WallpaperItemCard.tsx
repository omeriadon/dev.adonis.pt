import styles from "./WallpaperItemCard.module.css";
import Image from "next/image";

export interface WallpaperItemCardProps {
	// Display name under the card (e.g., the file's human label or "text of the thing")
	name: string;
	// Image file (can be a filename without ext, or with ext, or an absolute path)
	image: string;
	// Path to the folder's index.json used to resolve relative paths (e.g. "/wallpapers/<id>/index.json")
	path: string;
	// Optional thumbnail image (same rules as `image`). If omitted, the main image is used.
	thumbnail?: string;
}

function toFileName(maybeFile: string): string {
	const hasExt = /\.[a-zA-Z0-9]+$/.test(maybeFile || "");
	return hasExt ? maybeFile : `${maybeFile}.png`;
}

function joinPath(baseDir: string, file: string): string {
	if (!file) return "";
	// If it's an absolute path, leave it as-is (do not alter or append extensions)
	if (file.startsWith("/")) return file;
	// For relative paths, ensure a default extension if none is provided
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

	// Derive a friendly download name based on the provided name + image ext
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
