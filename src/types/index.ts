import { z } from "zod";
import type { ReactNode } from "react";

export const ProjectSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.string(),
	technologies: z.array(z.string()),
	githubUrl: z.string().url().optional(),
	demoUrl: z.string().url().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ContactItemSchema = z.object({
	label: z.string(),
	value: z.string(),
	href: z.string(),
});

export type ContactItem = z.infer<typeof ContactItemSchema>;

export const EducationEntrySchema = z.object({
	date: z.string(),
	title: z.string(),
	subtitle: z.string(),
	description: z.string(),
});

export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const CertificateSchema = z.object({
	id: z.string(),
	title: z.string(),
	year: z.string(),
	image: z.string(),
});

export type Certificate = z.infer<typeof CertificateSchema>;

export type RawCertificate = {
	id?: unknown;
	title?: unknown;
	year?: unknown;
	image?: unknown;
};

export const WallpaperCategorySchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	thumbnail: z.string().optional(),
	preview: z.string().optional(),
	path: z.string(),
});

export type WallpaperCategory = z.infer<typeof WallpaperCategorySchema>;

export const WallpaperItemSchema = z.object({
	key: z.string(),
	name: z.string(),
	image: z.string(),
	thumbnail: z.string().optional(),
	path: z.string(),
});

export type WallpaperItem = z.infer<typeof WallpaperItemSchema>;

export type WallpaperItemRecord =
	| {
			id?: string;
			text?: string;
			title?: string;
			name?: string;
			image?: string;
			thumbnail?: string;
			file?: string;
			src?: string;
			url?: string;
			path?: string;
			download?: string;
			preview?: string;
			thumb?: string;
	  }
	| string;

export type NavLink = {
	href: string;
	label: string;
};

export type Theme = "dark" | "light";

export type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

export const ExpertiseItemSchema = z.object({
	animID: z.string(),
	title: z.string(),
	description: z.string(),
	icon: z.custom<ReactNode>(),
});

export type ExpertiseItem = z.infer<typeof ExpertiseItemSchema>;
