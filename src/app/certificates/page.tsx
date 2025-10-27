import styles from "./certificates.module.css";
import { WallpaperCard } from "@/components/WallpaperCard";
import path from "node:path";
import { promises as fs } from "node:fs";

type CertificateRecord = {
	id: string;
	title: string;
	year: string;
	image: string;
};

type RawCertificate = {
	id?: unknown;
	title?: unknown;
	year?: unknown;
	image?: unknown;
};

function normalizeCertificates(data: unknown): CertificateRecord[] {
	if (!Array.isArray(data)) return [];
	return data
		.map((raw: RawCertificate, index) => {
			const fallbackId = `certificate-${index + 1}`;
			const id =
				typeof raw?.id === "string" && raw.id.trim().length
					? raw.id.trim()
					: fallbackId;
			const title =
				typeof raw?.title === "string" && raw.title.trim().length
					? raw.title.trim()
					: id;
			const yearValue =
				typeof raw?.year === "number"
					? raw.year
					: typeof raw?.year === "string" && raw.year.trim().length
						? Number.parseInt(raw.year, 10)
						: Number.NaN;
			const year = Number.isFinite(yearValue) ? String(yearValue) : "";
			const imageName =
				typeof raw?.image === "string" && raw.image.trim().length
					? raw.image.trim()
					: `${id}.avif`;
			return {
				id,
				title,
				year,
				image: imageName,
			};
		})
		.filter((item) => Boolean(item.id));
}

async function loadCertificatesFromDisk(): Promise<{
	certificates: CertificateRecord[];
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
			<h1 className={styles.heading}>Certificates</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{!error && !hasCertificates && (
				<p className={styles.status}>No certificates available right now.</p>
			)}
			{!error && hasCertificates && (
				<div className={styles.grid}>
					{certificates.map((cert) => {
						const imagePath = cert.image.startsWith("/")
							? cert.image
							: `/certificates/${cert.image}`;
						const subtitle = cert.year ? `${cert.year}` : "";
						return (
							<WallpaperCard
								key={cert.id}
								image={imagePath}
								cardTitle={cert.title}
								cardSubtitle={subtitle}
								imageAlt={cert.title}
								sizes="33vw"
								imageFit="contain"
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
