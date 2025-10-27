"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./WallpaperCategory.module.css";

export type WallpaperCardProps = {
	image?: string | null;
	cardTitle: string;
	cardSubtitle: string;
	imageAlt?: string;
	sizes?: string;
	className?: string;
	style?: CSSProperties;
	imageClassName?: string;
	imageWrapperClassName?: string;
	imageSlot?: ReactNode;
	imageFit?: CSSProperties["objectFit"];
};

export function WallpaperCard({
	image,
	cardTitle,
	cardSubtitle,
	imageAlt,
	sizes = "50vw",
	className,
	style,
	imageClassName,
	imageWrapperClassName,
	imageSlot,
	imageFit = "cover",
}: WallpaperCardProps) {
	const hasCustomImage = Boolean(imageSlot);
	const showPlaceholder = !hasCustomImage && !image;

	return (
		<div className={clsx(styles.card, className)} style={style}>
			<div className={clsx(styles.imageWrapper, imageWrapperClassName)}>
				{imageSlot ? (
					imageSlot
				) : (
					<div className={styles.imageContainer}>
						{showPlaceholder ? (
							<div className={styles.placeholder} aria-hidden="true" />
						) : (
							<Image
								src={image as string}
								alt={imageAlt || cardTitle}
								fill
								sizes={sizes}
								priority={true}
								loading="eager"
								fetchPriority="high"
								decoding="async"
								style={{ objectFit: imageFit, objectPosition: "center" }}
								className={clsx(styles.image, "noSelect", imageClassName)}
								draggable={false}
							/>
						)}
					</div>
				)}
			</div>
			<div className={styles.cardText}>
				<p className={styles.cardTitle}>{cardTitle || "\u00A0"}</p>
				<p className={styles.amountCount}>{cardSubtitle}</p>
			</div>
		</div>
	);
}
