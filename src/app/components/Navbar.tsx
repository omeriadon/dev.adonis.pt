"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
	const pathname = usePathname();

	const isActive = (href: string) =>
		pathname === href || (href !== "/" && pathname.startsWith(href));

	return (
		<nav className={styles.navbar}>
			<ul className={styles.navList}>
				<li>
					<Link
						href="/"
						className={cx(styles.navbarTitle, isActive("/") && styles.active)}
						aria-current={isActive("/") ? "page" : undefined}
					>
						Adon Omeri
					</Link>
				</li>
				<li>
					<Link
						href="/wallpapers"
						className={cx(
							styles.link,
							isActive("/wallpapers") && styles.active,
						)}
						aria-current={isActive("/wallpapers") ? "page" : undefined}
					>
						Wallpapers
					</Link>
				</li>
				<li>
					<a href="/contact" className={styles.link}>
						Contact
					</a>
				</li>
			</ul>
		</nav>
	);
}
