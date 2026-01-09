import type { Metadata } from "next";
import styles from "./certificates.module.css";
import { MediaCard } from "@/components/MediaCard";
import path from "node:path";
import { promises as fs } from "node:fs";
import { normalizeCertificates } from "@/lib/utils";
import type { Certificate } from "@/types";

export const metadata: Metadata = {
	title: "Certificates",
	description:
		"Professional certifications and course completions in networking, cybersecurity, and programming.",
};

async function loadCertificatesFromDisk(): Promise<{
	certificates: Certificate[];
	error: string | null;
}> {
	try {
		const filePath = path.join(
			process.cwd(),
			"public",
			"certificates",
			"index.json",
		);
		const file = await fs.readFile(filePath, "utf-8");
		const parsed = JSON.parse(file) as unknown;
		return { certificates: normalizeCertificates(parsed), error: null };
	} catch (err: unknown) {
		const message =
			err instanceof Error
				? err.message
				: typeof err === "string"
					? err
					: "Failed to read certificates.";
		return { certificates: [], error: message };
	}
}

export default async function Certificates() {
	const { certificates, error } = await loadCertificatesFromDisk();
	const hasCertificates = certificates.length > 0;

	return (
		<div className={styles.container}>
			{error && (
				<p className={styles.errorState} role="alert">
					{error}
				</p>
			)}
			{!error && !hasCertificates && (
				<p className={styles.status}>
					No certificates available right now.
				</p>
			)}
			{!error && hasCertificates && (
				<div className={styles.grid}>
					{certificates.map((cert) => {
						const imagePath = cert.image.startsWith("/")
							? cert.image
							: `/certificates/${cert.image}`;
						const subtitle = cert.year ? `${cert.year}` : "";
						return (
							<MediaCard
								key={cert.id}
								image={imagePath}
								cardTitle={cert.title}
								cardSubtitle={subtitle}
								imageAlt={cert.title}
								imageFit="contain"
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
