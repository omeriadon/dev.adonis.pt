import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
	{ href: "/projects", label: "Projects" },
	{ href: "/wallpapers", label: "Wallpapers" },
	{ href: "/education", label: "Education" },
	{ href: "/certificates", label: "Certificates" },
	{ href: "/contact", label: "Contact" },
];

export const routeTitles: Record<string, string> = {
	"/": "Adon Omeri",
	"/projects": "Projects",
	"/wallpapers": "Wallpapers",
	"/education": "Education",
	"/certificates": "Certificates",
	"/contact": "Contact",
};
