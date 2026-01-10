import styles from "./WallpaperCategory.module.css";
import Link from "next/link";
import path from "node:path";
import { promises as fs } from "node:fs";
import { MediaCard } from "./MediaCard";
import type { WallpaperCategory as WallpaperCategoryType } from "@/types";

export type CategoryProps = WallpaperCategoryType;

async function getWallpaperCount(categoryPath: string): Promise<number> {
	try {
		const relativePath = categoryPath.startsWith("/")
			? categoryPath.slice(1)
			: categoryPath;
		const filePath = path.join(process.cwd(), "public", relativePath);
		const file = await fs.readFile(filePath, "utf-8");
		const data = JSON.parse(file) as unknown;
		if (Array.isArray(data)) {
			return data.length;
		}
		if (
			data &&
			typeof data === "object" &&
			Array.isArray((data as Record<string, unknown>).images)
		) {
			return ((data as Record<string, unknown>).images as unknown[])
				.length;
		}
		return 0;
	} catch {
		return 0;
	}
}

export async function WallpaperCategory(props: CategoryProps) {
	const isPlaceholder = !props.thumbnail;
	const isAbsolute = props.thumbnail?.startsWith("/");
	const hasExt = /\.[a-zA-Z0-9]+$/.test(props.thumbnail || "");
	const fileName = hasExt ? props.thumbnail : `${props.thumbnail}.png`;
	const baseDir = props.path?.replace(/\/index\.json$/, "") || "";
	const thumbnailSrc = isAbsolute
		? hasExt
			? props.thumbnail
			: `${props.thumbnail}.avif`
		: `${baseDir}/${fileName}`;

	const wallpapersCount = await getWallpaperCount(props.path);
	const cardSubtitle =
		wallpapersCount > 0
			? `${wallpapersCount} wallpaper${wallpapersCount === 1 ? "" : "s"}`
			: "0 wallpapers";

	return (
		<Link
			href={`/wallpapers/${props.id}`}
			className={styles.cardLink}
			aria-label={`Open ${props.title}. ${cardSubtitle}.`}
		>
			<MediaCard
				image={isPlaceholder ? null : thumbnailSrc}
				cardTitle={props.title || "\u00A0"}
				cardSubtitle={cardSubtitle}
				imageAlt={props.title}
			/>
		</Link>
	);
}
