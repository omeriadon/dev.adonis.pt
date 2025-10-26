"use client";

import styles from "./wallpapers.module.css";
import { useState, useEffect } from "react";
import { WallpaperCategory } from "@/components/WallpaperCategory";

export default function Wallpapers() {
	type Category = {
		id: string;
		title: string;
		description: string;
		tags: string[];
		thumbnail: string;
		path: string;
	};

	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const res = await fetch("/wallpapers/index.json", {
					cache: "no-cache",
				});
				if (!res.ok) {
					throw new Error(
						`Failed to load categories: ${res.status} ${res.statusText}`,
					);
				}
				const data = await res.json();
				if (!cancelled) {
					setCategories(Array.isArray(data) ? data : []);
				}
			} catch (e: any) {
				if (!cancelled) setError(e?.message || "Failed to load categories");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		let raf1 = 0;
		let raf2 = 0;
		raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => setReady(true));
		});
		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
		};
	}, []);

	return (
		<div>
			<div>
				{loading && <p></p>}
				{!loading && error && <p style={{ color: "red" }}>{error}</p>}
				{!loading && !error && categories.length === 0 && (
					<p>No categories found.</p>
				)}
				{/*{!loading && !error && (*/}
				{!loading && !error && ready && (
					<div className={styles.grid}>
						{categories.map((cat) => (
							<WallpaperCategory
								key={cat.id}
								id={cat.id}
								title={cat.title}
								description={cat.description}
								tags={cat.tags}
								thumbnail={cat.thumbnail}
								path={cat.path}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
