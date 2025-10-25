import styles from "./Navbar.module.css";

export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<ul className={styles.navList}>
				<li>
					<a href="/" className={styles.navbarTitle}>
						Adon Omeri
					</a>
				</li>
				<li>
					<a href="/wallpapers" className={styles.link}>
						Wallpapers
					</a>
				</li>
				<li>
					<a href="#" className={styles.link}>
						Contact
					</a>
				</li>
			</ul>
		</nav>
	);
}
