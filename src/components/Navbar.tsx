"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Navbar.module.css";
import { navLinks } from "@/data/navigation";
import { ProgressiveBlur } from "./ProgressiveBlur";

const MOBILE_BREAKPOINT = 1000;

export default function Navbar() {
	const pathname = usePathname();

	const [isMobile, setIsMobile] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);

	const [openForPath, setOpenForPath] = useState<string | null>(null);

	const [scrolled, setScrolled] = useState(false);

	const [collapseHeight, setCollapseHeight] = useState(0);
	const collapseInnerRef = useRef<HTMLDivElement | null>(null);

	const [isVisible, setIsVisible] = useState(false);

	const open = isMobile && menuOpen && openForPath === pathname;

	useEffect(() => {
		const visited = sessionStorage.getItem("intro-shown");
		if (visited) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => {
				setIsVisible(true);
				sessionStorage.setItem("intro-shown", "true");
			}, 17000);
			return () => clearTimeout(timer);
		}
	}, []);

	useEffect(() => {
		const update = () =>
			setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	useEffect(() => {
		const getThreshold = () => {
			const remInPx = parseFloat(
				getComputedStyle(document.documentElement).fontSize,
			);
			return window.innerWidth > 1000 ? 10 * remInPx : 6 * remInPx;
		};

		const handleScroll = () => {
			setScrolled(window.scrollY > getThreshold());
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	useEffect(() => {
		if (!isMobile) return;
		const inner = collapseInnerRef.current;
		if (!inner) return;

		const updateHeight = () => {
			setCollapseHeight(inner.offsetHeight);
		};

		updateHeight();

		let observer: ResizeObserver | undefined;
		if (typeof ResizeObserver !== "undefined") {
			observer = new ResizeObserver(updateHeight);
			observer.observe(inner);
		}

		window.addEventListener("resize", updateHeight);
		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener("resize", updateHeight);
		};
	}, [isMobile, open, pathname]);

	const isActive = (href: string) =>
		pathname === href || (href !== "/" && pathname.startsWith(href));

	const collapseStyle = isMobile
		? {
				height: open ? collapseHeight : 0,
				opacity: open ? 1 : 0,
			}
		: undefined;

	const mobileNavId = "navbar-mobile-links";

	const closeMenu = () => {
		setMenuOpen(false);
	};

	const toggleMenu = () => {
		setMenuOpen((prev) => {
			if (prev) return false;
			setOpenForPath(pathname);
			return true;
		});
	};

	return (
		<header className={styles.header}>
			<ProgressiveBlur
				className={styles.blur}
				blurIntensity={4.0}
				blurLayers={7}
			/>
			<nav
				className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
				style={{
					opacity: isVisible ? 1 : 0,
					transition: "opacity 0.8s ease, border-color 0.3s ease",
					pointerEvents: isVisible ? "auto" : "none",
				}}
			>
				<div className={styles.topRow}>
					<Link
						href="/"
						className={clsx(
							styles.navbarTitle,
							isActive("/") && styles.active,
						)}
						aria-current={isActive("/") ? "page" : undefined}
						onClick={() => {
							if (isMobile) closeMenu();
						}}
					>
						Adon Omeri
					</Link>

					<ul className={clsx(styles.navList, styles.desktopNav)}>
						{navLinks.map((item) => {
							const active = isActive(item.href);
							return (
								<li key={`desktop-${item.href}`}>
									<Link
										href={item.href}
										className={clsx(
											styles.link,
											active && styles.active,
										)}
										aria-current={
											active ? "page" : undefined
										}
									>
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>

					<button
						type="button"
						className={styles.toggle}
						onClick={toggleMenu}
						aria-expanded={open}
						aria-controls={mobileNavId}
						aria-label="Toggle navigation"
						data-open={open}
					>
						<span
							className={styles.toggleLabelClosed}
							aria-hidden="true"
						>
							...
						</span>
						<span
							className={styles.toggleLabelOpen}
							aria-hidden="true"
						>
							×
						</span>
					</button>
				</div>

				<div
					id={mobileNavId}
					className={styles.collapseWrapper}
					style={collapseStyle}
					aria-hidden={isMobile ? !open : true}
				>
					<div
						ref={collapseInnerRef}
						className={styles.collapseInner}
					>
						<ul
							className={clsx(
								styles.navList,
								styles.mobileNavList,
							)}
						>
							{navLinks.map((item) => {
								const active = isActive(item.href);
								return (
									<li key={`mobile-${item.href}`}>
										<Link
											href={item.href}
											className={clsx(
												styles.link,
												active && styles.active,
											)}
											aria-current={
												active ? "page" : undefined
											}
											onClick={() => {
												if (isMobile) closeMenu();
											}}
										>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
}
