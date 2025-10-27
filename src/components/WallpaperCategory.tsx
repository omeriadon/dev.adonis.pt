"use client";
import styles from "./WallpaperCategory.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface CategoryProps {
	id: string;
	title: string;
	description: string;
	tags: string[];
	thumbnail: string;
	preview: string;
	path: string;
}

export function WallpaperCategory(props: CategoryProps) {
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

	const [wallpapersCount, setWallpapersCount] = useState<number | null>(null);
	useEffect(() => {
		let active = true;
		const indexPath = props.path?.startsWith("/")
			? props.path
			: `/${props.path}`;
		fetch(indexPath, { cache: "force-cache" })
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!active) return;
				let count = 0;
				if (Array.isArray(data)) {
					count = data.length;
				} else if (data && Array.isArray((data as any).images)) {
					count = (data as any).images.length;
				}
				setWallpapersCount(count);
			})
			.catch(() => {
				if (active) setWallpapersCount(0);
			});
		return () => {
			active = false;
		};
	}, [props.path]);
	return (
		<Link href={`/wallpapers/${props.id}`} className={styles.card}>
			<div className={styles.imageWrapper}>
				{!isPlaceholder ? (
					<Image
						src={thumbnailSrc}
						alt={props.title}
						fill
						sizes="50vw"
						priority
						fetchPriority="high"
						decoding="async"
						style={{ objectFit: "cover", objectPosition: "center" }}
						className={`${styles.image} noSelect`}
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
				<p className={styles.cardTitle}>{props.title || "\u00A0"}</p>
				<p className={styles.amountCount}>
					{Number(wallpapersCount) > 0
						? `${Number(wallpapersCount)} wallpaper${Number(wallpapersCount) === 1 ? "" : "s"}`
						: "0 wallpapers"}
				</p>
			</div>
		</Link>
	);
}
