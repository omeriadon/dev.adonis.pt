"use client";

import { useState, useCallback, useMemo } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import { MediaCard } from "@/components/MediaCard";
import styles from "@/components/WallpaperCategory.module.css";
import mediaStyles from "@/components/MediaCard.module.css";
import {
	joinPath,
	slugify,
	buildDownloadName,
	type NormalizedWallpaperItem,
} from "@/lib/utils";

export type DownloadAllCardProps = {
	items: NormalizedWallpaperItem[];
	categoryTitle?: string;
	categoryId: string;
};

export function DownloadAllCard({
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
						throw new Error(
							`${response.status} ${response.statusText}`,
						);
					}
					const blob = await response.blob();
					const fileName = buildDownloadName(item.name, item.image);
					zip.file(fileName, blob);
					addedFiles += 1;
				} catch {}
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
			className={styles.cardLink}
			style={pointerStyle}
			aria-disabled={downloading}
			aria-busy={downloading}
			aria-label={statusLabel}
			title={error ? error : undefined}
		>
			<MediaCard
				cardTitle="all"
				cardSubtitle={countLabel}
				imageWrapperClassName={mediaStyles.collageWrapper}
				imageSlot={
					<>
						<div className={mediaStyles.collageGrid}>
							{previewSources.map((src, idx) => (
								<div
									className={mediaStyles.collageTile}
									key={`${src}-${idx}`}
								>
									<Image
										src={src}
										alt={previewContext}
										fill
										sizes="25vw"
										style={{
											objectFit: "cover",
											objectPosition: "center",
										}}
										priority={idx < 2}
										draggable={false}
									/>
								</div>
							))}
						</div>
						{downloading && (
							<div className={styles.loadingOverlay}>
								<div className={styles.spinner} />
							</div>
						)}
					</>
				}
			/>
		</a>
	);
}
