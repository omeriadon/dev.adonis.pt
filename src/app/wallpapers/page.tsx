import type { Metadata } from "next";
import styles from "./wallpapers.module.css";
import path from "node:path";
import { promises as fs } from "node:fs";
import { WallpaperCategory } from "@/components/WallpaperCategory";
import { normalizeWallpaperCategories } from "@/lib/utils";
import type { WallpaperCategory as WallpaperCategoryType } from "@/types";

export const metadata: Metadata = {
	title: "Wallpapers",
	description: "Browse and download curated wallpaper collections.",
};

async function loadWallpaperCategories(): Promise<{
	categories: WallpaperCategoryType[];
	error: string | null;
}> {
	try {
		const filePath = path.join(
			process.cwd(),
			"public",
			"wallpapers",
			"index.json",
		);
		const file = await fs.readFile(filePath, "utf-8");
		const parsed = JSON.parse(file) as unknown;
		return {
			categories: normalizeWallpaperCategories(parsed),
			error: null,
		};
	} catch (err: unknown) {
		const message =
			err instanceof Error
				? err.message
				: typeof err === "string"
					? err
					: "Failed to read wallpaper categories.";
		return { categories: [], error: message };
	}
}

export default async function WallpapersPage() {
	const { categories, error } = await loadWallpaperCategories();
	const hasCategories = categories.length > 0;

	return (
		<div>
			{error && (
				<p className={styles.errorState} role="alert">
					{error}
				</p>
			)}
			{!error && !hasCategories && (
				<p className={styles.emptyState}>No categories found.</p>
			)}
			{!error && hasCategories && (
				<div className={styles.grid}>
					{categories.map((cat) => (
						<WallpaperCategory
							key={cat.id}
							id={cat.id}
							title={cat.title}
							description={cat.description}
							tags={cat.tags}
							thumbnail={cat.thumbnail}
							preview={cat.preview}
							path={cat.path}
						/>
					))}
				</div>
			)}
		</div>
	);
}
