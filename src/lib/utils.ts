import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Certificate, RawCertificate, WallpaperCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toFileName(maybeFile: string): string {
	const hasExt = /\.[a-zA-Z0-9]+$/.test(maybeFile || "");
	return hasExt ? maybeFile : `${maybeFile}.png`;
}

export function joinPath(baseDir: string, file: string): string {
	if (!file) return "";
	if (file.startsWith("/")) return file;
	const hasExt = /\.[a-zA-Z0-9]+$/.test(file || "");
	const rel = hasExt ? file : `${file}.png`;
	return `${baseDir}/${rel}`;
}

export function slugify(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function buildDownloadName(
	name: string | undefined,
	image: string,
): string {
	const ext =
		(toFileName(image).match(/\.[a-zA-Z0-9]+$/)?.[0] as
			| string
			| undefined) || ".png";
	const fallbackBase =
		toFileName(image)
			.split("/")
			.pop()
			?.replace(/\.[^.]+$/, "") || "wallpaper";
	const downloadBase =
		name && name.trim().length ? slugify(name) : slugify(fallbackBase);
	const safeBase = downloadBase || "wallpaper";
	return `${safeBase}${ext}`;
}

export function basenameNoExt(path: string): string {
	const file = path.split("/").pop() || path;
	return file.replace(/\.[^.]+$/, "");
}

export function guessPreviewPath(imagePath: string): string {
	if (!imagePath) return "";
	if (imagePath.endsWith(".avif")) return imagePath;
	const hasExt = /\.[a-zA-Z0-9]+$/.test(imagePath);
	if (!hasExt) return `${imagePath}.avif`;
	return imagePath.replace(/\.[^.]+$/, ".avif");
}

export function normalizeCertificates(data: unknown): Certificate[] {
	if (!Array.isArray(data)) return [];
	return data
		.map((raw: RawCertificate, index) => {
			const fallbackId = `certificate-${index + 1}`;
			const id =
				typeof raw?.id === "string" && raw.id.trim().length
					? raw.id.trim()
					: fallbackId;
			const title =
				typeof raw?.title === "string" && raw.title.trim().length
					? raw.title.trim()
					: id;
			const yearValue =
				typeof raw?.year === "number"
					? raw.year
					: typeof raw?.year === "string" && raw.year.trim().length
						? Number.parseInt(raw.year, 10)
						: Number.NaN;
			const year = Number.isFinite(yearValue) ? String(yearValue) : "";
			const imageName =
				typeof raw?.image === "string" && raw.image.trim().length
					? raw.image.trim()
					: `${id}.avif`;
			return {
				id,
				title,
				year,
				image: imageName,
			};
		})
		.filter((item) => Boolean(item.id));
}

export function normalizeWallpaperCategory(
	raw: Record<string, unknown>,
	index: number,
): WallpaperCategory {
	const id =
		typeof raw?.id === "string" && (raw.id as string).trim().length
			? (raw.id as string)
			: `category-${index + 1}`;
	const title =
		typeof raw?.title === "string" && (raw.title as string).trim().length
			? (raw.title as string)
			: id;
	const description =
		typeof raw?.description === "string" ? (raw.description as string) : "";
	const preview =
		typeof raw?.preview === "string" &&
		(raw.preview as string).trim().length
			? (raw.preview as string)
			: "";
	const thumbnail =
		typeof raw?.thumbnail === "string" &&
		(raw.thumbnail as string).trim().length
			? (raw.thumbnail as string)
			: preview;
	const tags = Array.isArray(raw?.tags)
		? (raw.tags as unknown[]).filter(
				(tag: unknown): tag is string =>
					typeof tag === "string" && tag.trim().length > 0,
			)
		: [];
	const path =
		typeof raw?.path === "string" && (raw.path as string).trim().length
			? (raw.path as string)
			: "";
	return {
		id,
		title,
		description,
		tags,
		thumbnail,
		preview,
		path,
	};
}

export function normalizeWallpaperCategories(
	data: unknown,
): WallpaperCategory[] {
	if (!Array.isArray(data)) return [];
	return data.map((raw, index) =>
		normalizeWallpaperCategory(raw as Record<string, unknown>, index),
	);
}

export type WallpaperItemRecord = string | Record<string, unknown>;

export interface NormalizedWallpaperItem {
	key: string;
	name: string;
	image: string;
	thumbnail?: string;
	path: string;
}

export function normalizeWallpaperItems(
	items: WallpaperItemRecord[],
	categoryPath: string,
): NormalizedWallpaperItem[] {
	return items.map((it, idx) => {
		if (typeof it === "string") {
			const image = it;
			return {
				key: `${idx}-${image}`,
				name: basenameNoExt(image),
				image,
				thumbnail: guessPreviewPath(image) || undefined,
				path: categoryPath,
			};
		}
		const rawObj = it;
		const preview =
			typeof rawObj?.preview === "string" &&
			(rawObj.preview as string).trim().length
				? (rawObj.preview as string)
				: undefined;
		const image =
			(rawObj?.file as string) ??
			(rawObj?.image as string) ??
			(rawObj?.src as string) ??
			(rawObj?.url as string) ??
			(rawObj?.path as string) ??
			(rawObj?.download as string) ??
			preview ??
			"";
		const displayText =
			typeof rawObj?.text === "string" &&
			(rawObj.text as string).trim().length
				? (rawObj.text as string)
				: undefined;
		const name =
			displayText ??
			(rawObj?.name as string) ??
			(rawObj?.title as string) ??
			(rawObj?.id as string) ??
			(image ? basenameNoExt(image) : `item-${idx + 1}`);
		const thumbnail =
			preview ??
			(rawObj?.thumbnail as string) ??
			(rawObj?.thumb as string) ??
			(guessPreviewPath(image) || undefined);
		return {
			key: (rawObj?.id as string) || `${idx}-${name}`,
			name,
			image,
			thumbnail,
			path: categoryPath,
		};
	});
}
