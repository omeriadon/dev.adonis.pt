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
	type NormalizedWallpaperItem,
	type WallpaperItemRecord,
} from "@/lib/utils";
import type { WallpaperCategory } from "@/types";

type PageParams = Promise<{ id: string }>;

type CacheEntry<T> = { value: T; timestamp: number };

const CATEGORY_CACHE_TTL = 60 * 1000;
const ITEM_CACHE_TTL = 60 * 1000;

let categoryCache: CacheEntry<WallpaperCategory[]> | null = null;
const wallpaperItemsCache = new Map<
	string,
	CacheEntry<NormalizedWallpaperItem[]>
>();

export const revalidate = 60;

async function readPublicJson(relativePath: string) {
	const normalizedPath = relativePath.startsWith("/")
		? relativePath.slice(1)
		: relativePath;
	const filePath = path.join(process.cwd(), "public", normalizedPath);
	const file = await fs.readFile(filePath, "utf-8");
	return JSON.parse(file) as unknown;
}

async function loadCategories(): Promise<WallpaperCategory[]> {
	const now = Date.now();
	if (categoryCache && now - categoryCache.timestamp < CATEGORY_CACHE_TTL) {
		return categoryCache.value;
	}

	try {
		const data = await readPublicJson("wallpapers/index.json");
		const categories = normalizeWallpaperCategories(data);
		categoryCache = { value: categories, timestamp: now };
		return categories;
	} catch {
		return [];
	}
}

async function loadCategory(
	categoryId: string,
): Promise<WallpaperCategory | null> {
	const categories = await loadCategories();
	return categories.find((c) => c.id === categoryId) ?? null;
}

async function loadWallpaperItems(categoryPath: string) {
	const now = Date.now();
	const cacheKey = categoryPath;
	const cached = wallpaperItemsCache.get(cacheKey);
	if (cached && now - cached.timestamp < ITEM_CACHE_TTL) {
		return cached.value;
	}

	try {
		const data = await readPublicJson(categoryPath);
		const list: WallpaperItemRecord[] = Array.isArray(data)
			? data
			: Array.isArray((data as Record<string, unknown>)?.items)
				? ((data as Record<string, unknown>)
						.items as WallpaperItemRecord[])
				: [];
		const normalized = normalizeWallpaperItems(list, categoryPath);
		wallpaperItemsCache.set(cacheKey, {
			value: normalized,
			timestamp: now,
		});
		return normalized;
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
