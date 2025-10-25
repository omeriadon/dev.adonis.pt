"use client";
// Footer.tsx
import { useTheme } from "./ThemeProvider";
import styles from "./Footer.module.css";

export default function Footer() {
	const { theme, toggleTheme } = useTheme();

	const colors = [
		"#d59d41",
		"#3d1909",
		"#753888",
		"#d0dfe0",
		"#da3d46",
		"#63d6a1",
		"#e89163",
		"#455b82",
		"#101a8d",
		"#000000",
		"#332923",
		"#323332",
		"#b79f72",
	];

	return (
		<footer className={styles.footer}>
			<div className={styles.innerContent}>
				<p>Adon Omeri</p>
				<button
					type="button"
					onClick={toggleTheme}
					title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
				>
					Switch theme: {theme}
				</button>
			</div>
			<div style={{ display: "flex", gap: "0px" }}>
				{colors.map((color, i) => (
					<div
						key={i}
						style={{ backgroundColor: color, flex: 1, height: "5px" }}
					/>
				))}
			</div>
		</footer>
	);
}
