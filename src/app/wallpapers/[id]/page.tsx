"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { useParams } from "next/navigation";
import styles from "../wallpapers.module.css";
import WallpaperItemCard, {
	buildDownloadName,
	joinPath,
	slugify,
} from "@/components/WallpaperItemCard";
import Image from "next/image";
import categoryStyles from "@/components/WallpaperCategory.module.css";

type CategoryMeta = {
	id: string;
	title: string;
	description?: string;
	thumbnail?: string;
	preview?: string;
	path: string;
};

type ItemRecord =
	| {
			id?: string;
			text?: string;
			title?: string;
			name?: string;
			image?: string;
			thumbnail?: string;
	  }
	| string;

function isStringItem(v: ItemRecord): v is string {
	return typeof v === "string";
}

function basenameNoExt(path: string) {
	const file = path.split("/").pop() || path;
	return file.replace(/\.[^.]+$/, "");
}

function guessPreviewPath(imagePath: string) {
	if (!imagePath) return "";
	if (imagePath.endsWith(".avif")) return imagePath;
	const hasExt = /\.[a-zA-Z0-9]+$/.test(imagePath);
	if (!hasExt) return `${imagePath}.avif`;
	return imagePath.replace(/\.[^.]+$/, ".avif");
}

type NormalizedItem = {
	key: string;
	name: string;
	image: string;
	thumbnail?: string;
	path: string;
};

type DownloadAllCardProps = {
	items: NormalizedItem[];
	categoryTitle?: string;
	categoryId: string;
};

function DownloadAllCard({
	items,
	categoryTitle,
	categoryId,
}: DownloadAllCardProps) {
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const previewSources = useMemo(() => {
		return items
			.map((item) => {
				const baseDir = item.path?.replace(/\/index\.json$/, "") || "";
				const candidate = item.thumbnail || item.image;
				return joinPath(baseDir, candidate);
			})
			.filter((src): src is string => Boolean(src))
			.slice(0, 4);
	}, [items]);

	const hasContent = items.length > 0 && previewSources.length > 0;

	const handleDownloadAll = useCallback(async () => {
		setDownloading(true);
		setError(null);
		try {
			const { default: JSZip } = await import("jszip");
			const zip = new JSZip();
			let addedFiles = 0;

			for (const item of items) {
				const baseDir = item.path?.replace(/\/index\.json$/, "") || "";
				const assetPath = joinPath(baseDir, item.image);
				if (!assetPath) continue;

				try {
					const response = await fetch(assetPath);
					if (!response.ok) {
						throw new Error(`${response.status} ${response.statusText}`);
					}
					const blob = await response.blob();
					const fileName = buildDownloadName(item.name, item.image);
					zip.file(fileName, blob);
					addedFiles += 1;
				} catch (innerError: unknown) {
					console.warn("Failed to add wallpaper to archive", innerError);
				}
			}

			if (!addedFiles) {
				throw new Error("No wallpapers available to download.");
			}

			const zipBlob = await zip.generateAsync({ type: "blob" });
			const url = URL.createObjectURL(zipBlob);
			const titleBase =
				categoryTitle && categoryTitle.trim().length
					? categoryTitle
					: categoryId;
			const archiveNameBase =
				slugify(titleBase || "wallpapers") || "wallpapers";
			const archiveName = `${archiveNameBase}-${addedFiles}.zip`;
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = archiveName;
			anchor.style.display = "none";
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
			URL.revokeObjectURL(url);
		} catch (err: unknown) {
			console.error(err);
			const message =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: "Failed to download wallpapers.";
			setError(message);
		} finally {
			setDownloading(false);
		}
	}, [items, categoryTitle, categoryId]);

	const handleCardClick = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			if (downloading) return;
			void handleDownloadAll();
		},
		[downloading, handleDownloadAll],
	);

	const pointerStyle: CSSProperties | undefined = downloading
		? { pointerEvents: "none", opacity: 0.7 }
		: undefined;
	const countLabel = `${items.length} wallpaper${
		items.length === 1 ? "" : "s"
	}`;
	const previewContext = categoryTitle || categoryId || "wallpapers";
	const statusLabel = downloading
		? `Preparing download of ${countLabel}`
		: error
			? `Last error: ${error}`
			: `Download all ${countLabel}`;

	if (!hasContent) {
		return null;
	}

	return (
		<a
			href="#"
			onClick={handleCardClick}
			className={categoryStyles.card}
			style={pointerStyle}
			aria-disabled={downloading}
			aria-busy={downloading}
			aria-label={statusLabel}
			title={error ? error : undefined}
		>
			<div className={categoryStyles.imageWrapper}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						padding: 10,
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gridTemplateRows: "repeat(2, 1fr)",
						gap: 10,
						borderRadius: 30,
						overflow: "hidden",
					}}
				>
					{previewSources.map((src, idx) => (
						<div
							key={`${src}-${idx}`}
							style={{
								position: "relative",
								borderRadius: 20,
								overflow: "hidden",
							}}
						>
							<Image
								src={src}
								alt={`Preview ${idx + 1} for ${previewContext}`}
								fill
								sizes="25vw"
								style={{ objectFit: "cover", objectPosition: "center" }}
								priority={idx < 2}
								draggable={false}
							/>
						</div>
					))}
				</div>
			</div>
			<div className={categoryStyles.cardText}>
				<p className={categoryStyles.cardTitle}>all</p>
				<p className={categoryStyles.amountCount}>{countLabel}</p>
			</div>
		</a>
	);
}

export default function WallpaperSetPage() {
	const params = useParams() as { id?: string };
	const id = params?.id || "";

	const [meta, setMeta] = useState<CategoryMeta | null>(null);
	const [items, setItems] = useState<ItemRecord[]>([]);
	const [loadingMeta, setLoadingMeta] = useState(true);
	const [loadingItems, setLoadingItems] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		async function loadMeta() {
			try {
				setLoadingMeta(true);
				setError(null);
				const res = await fetch("/wallpapers/index.json", {
					cache: "no-cache",
				});
				if (!res.ok) {
					throw new Error(
						`Failed to load root index: ${res.status} ${res.statusText}`,
					);
				}
				const data = await res.json();
				const categories: CategoryMeta[] = Array.isArray(data) ? data : [];
				const found = categories.find((c) => c.id === id) || null;
				if (!cancelled) {
					if (!found) {
						setError(`Category "${id}" not found`);
					}
					setMeta(found);
				}
			} catch (e: any) {
				if (!cancelled)
					setError(e?.message || "Failed to load root categories");
			} finally {
				if (!cancelled) setLoadingMeta(false);
			}
		}
		if (id) {
			loadMeta();
		} else {
			setError("No category id provided");
			setLoadingMeta(false);
		}
		return () => {
			cancelled = true;
		};
	}, [id]);

	useEffect(() => {
		let cancelled = false;
		async function loadItems() {
			if (!meta?.path) {
				setItems([]);
				setLoadingItems(false);
				return;
			}
			try {
				setLoadingItems(true);
				setError(null);
				const res = await fetch(meta.path, { cache: "no-cache" });
				if (!res.ok) {
					throw new Error(
						`Failed to load items: ${res.status} ${res.statusText}`,
					);
				}
				const data = await res.json();
				const list: ItemRecord[] = Array.isArray(data)
					? data
					: Array.isArray(data?.items)
						? data.items
						: [];
				if (!cancelled) setItems(list);
			} catch (e: any) {
				if (!cancelled) setError(e?.message || "Failed to load items");
			} finally {
				if (!cancelled) setLoadingItems(false);
			}
		}
		if (meta?.path) {
			loadItems();
		}
		return () => {
			cancelled = true;
		};
	}, [meta?.path]);

	const headerDescription = meta?.description || "";

	const normalized: NormalizedItem[] = useMemo(() => {
		return items.map((it, idx) => {
			if (isStringItem(it)) {
				const image = it;
				return {
					key: `${idx}-${image}`,
					name: basenameNoExt(image),
					image,
					thumbnail: guessPreviewPath(image) || undefined,
					path: meta?.path || "",
				};
			} else {
				const rawObj = it as any;
				const preview =
					typeof rawObj?.preview === "string" && rawObj.preview.trim().length
						? rawObj.preview
						: undefined;
				const image =
					rawObj?.file ??
					rawObj?.image ??
					rawObj?.src ??
					rawObj?.url ??
					rawObj?.path ??
					rawObj?.download ??
					preview ??
					"";
				const displayText =
					typeof rawObj?.text === "string" && rawObj.text.trim().length
						? rawObj.text
						: undefined;
				const name =
					displayText ??
					rawObj?.name ??
					rawObj?.title ??
					rawObj?.id ??
					(image ? basenameNoExt(image) : `item-${idx + 1}`);
				const thumbnail =
					preview ??
					rawObj?.thumbnail ??
					rawObj?.thumb ??
					(guessPreviewPath(image) || undefined);
				return {
					key: rawObj?.id || `${idx}-${name}`,
					name,
					image,
					thumbnail,
					path: meta?.path || "",
				};
			}
		});
	}, [items, meta?.path]);

	return (
		<div>
			{/* Header */}
			<div style={{ marginBottom: 20 }}>
				{headerDescription ? (
					<p className={styles.description}>{headerDescription}</p>
				) : null}
			</div>

			{/* Loading / error states */}
			{(loadingMeta || loadingItems) && <p></p>}
			{!loadingMeta && !loadingItems && error && (
				<p style={{ color: "red" }}>{error}</p>
			)}
			{!loadingMeta && !loadingItems && !error && !normalized.length && (
				<p>No wallpapers found.</p>
			)}

			{/* Grid of downloadable items */}
			{!loadingMeta && !loadingItems && !error && normalized.length > 0 && (
				<div className={styles.grid}>
					{normalized.map((n) => (
						<WallpaperItemCard
							key={n.key}
							name={n.name}
							image={n.image}
							thumbnail={n.thumbnail}
							path={n.path}
						/>
					))}
					<DownloadAllCard
						items={normalized}
						categoryTitle={meta?.title}
						categoryId={id}
					/>
				</div>
			)}
		</div>
	);
}
