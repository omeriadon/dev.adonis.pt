"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./Footer.module.css";
import { forwardRef, HTMLAttributes } from "react";

interface FooterProps extends HTMLAttributes<HTMLElement> {}

const Footer = forwardRef<HTMLElement, FooterProps>(({ ...props }, ref) => {
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
		<footer ref={ref} className={styles.footer} role="contentinfo" {...props}>
			<div className={styles.innerContent}>
				<p className="noSelect">Adon Omeri</p>
				<button
					type="button"
					onClick={toggleTheme}
					title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
				>
					Switch theme: {theme}
				</button>
			</div>
			<div style={{ display: "flex", gap: "0px", margin: "0 -16px" }}>
				{colors.map((color, i) => (
					<div
						key={i}
						style={{ backgroundColor: color, flex: 1, height: "5px" }}
					/>
				))}
			</div>
		</footer>
	);
});

Footer.displayName = "Footer";

export default Footer;
