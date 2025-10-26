"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../wallpapers.module.css";
import WallpaperItemCard from "@/components/WallpaperItemCard";

type CategoryMeta = {
	id: string;
	title: string;
	description?: string;
	thumbnail?: string;
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

	const normalized = useMemo(() => {
		return items.map((it, idx) => {
			if (isStringItem(it)) {
				const image = it;
				return {
					key: `${idx}-${image}`,
					name: basenameNoExt(image),
					image,
					thumbnail: undefined as string | undefined,
					path: meta?.path || "",
				};
			} else {
				const rawObj = it as any;
				const image =
					rawObj?.file ??
					rawObj?.image ??
					rawObj?.src ??
					rawObj?.url ??
					rawObj?.path ??
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
				const thumbnail = rawObj?.thumbnail ?? rawObj?.thumb;
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
				</div>
			)}
		</div>
	);
}
