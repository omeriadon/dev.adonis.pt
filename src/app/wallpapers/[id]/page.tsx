import type { Metadata } from "next";
import path from "node:path";
import { promises as fs } from "node:fs";
import { notFound } from "next/navigation";
import styles from "../wallpapers.module.css";
import WallpaperItemCard from "@/components/WallpaperItemCard";
import { DownloadAllCard } from "@/components/DownloadAllCard";
import {
	normalizeWallpaperCategories,
	normalizeWallpaperItems,
	type WallpaperItemRecord,
} from "@/lib/utils";
import type { WallpaperCategory } from "@/types";

type PageParams = Promise<{ id: string }>;

async function loadCategory(
	categoryId: string,
): Promise<WallpaperCategory | null> {
	try {
		const filePath = path.join(
			process.cwd(),
			"public",
			"wallpapers",
			"index.json",
		);
		const file = await fs.readFile(filePath, "utf-8");
		const parsed = JSON.parse(file) as unknown;
		const categories = normalizeWallpaperCategories(parsed);
		return categories.find((c) => c.id === categoryId) ?? null;
	} catch {
		return null;
	}
}

async function loadWallpaperItems(categoryPath: string) {
	try {
		const relativePath = categoryPath.startsWith("/")
			? categoryPath.slice(1)
			: categoryPath;
		const filePath = path.join(process.cwd(), "public", relativePath);
		const file = await fs.readFile(filePath, "utf-8");
		const data = JSON.parse(file) as unknown;
		const list: WallpaperItemRecord[] = Array.isArray(data)
			? data
			: Array.isArray((data as Record<string, unknown>)?.items)
				? ((data as Record<string, unknown>)
						.items as WallpaperItemRecord[])
				: [];
		return normalizeWallpaperItems(list, categoryPath);
	} catch {
		return [];
	}
}

export async function generateMetadata({
	params,
}: {
	params: PageParams;
}): Promise<Metadata> {
	const { id } = await params;
	const category = await loadCategory(id);
	return {
		title: category?.title ?? "Wallpapers",
		description:
			category?.description ?? "Browse wallpapers in this category.",
	};
}

export default async function WallpaperSetPage({
	params,
}: {
	params: PageParams;
}) {
	const { id: categoryId } = await params;
	const category = await loadCategory(categoryId);

	if (!category) {
		notFound();
	}

	const items = await loadWallpaperItems(category.path);

	return (
		<div>
			{category.description && (
				<div style={{ marginBottom: 20 }}>
					<p className={styles.description}>{category.description}</p>
				</div>
			)}

			{items.length === 0 && (
				<p className={styles.emptyState}>No wallpapers found.</p>
			)}

			{items.length > 0 && (
				<div className={styles.grid}>
					{items.map((item) => (
						<WallpaperItemCard
							key={item.key}
							name={item.name}
							image={item.image}
							thumbnail={item.thumbnail}
							path={item.path}
						/>
					))}
					<DownloadAllCard
						items={items}
						categoryTitle={category.title}
						categoryId={categoryId}
					/>
				</div>
			)}
		</div>
	);
}
