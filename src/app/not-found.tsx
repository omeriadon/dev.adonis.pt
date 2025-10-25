import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-(--red) text-9xl font-bold mb-8 mt-28">404</h1>
			<p className="text-(--red) text-3xl mb-8">Page not found</p>
			<Link href="/" className="text-(--blue) text-2xl underline">
				Go back home
			</Link>
		</div>
	);
}
