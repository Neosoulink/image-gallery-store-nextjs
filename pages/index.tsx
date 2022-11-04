import Head from "next/head";
import Link from "next/link";

export default function Home() {
	return (
		<div className="h-screen w-screen overflow-hidden flex flex-col">
			<Head>
				<title>IG-Store - Home</title>
			</Head>

			<main className="flex flex-col flex-1 justify-center items-center w-full pt-20 pb-5 overflow-y-auto">
				<h1 className="font-bold text-6xl mb-4">
					Welcome to <span className="text-indigo-500">Stored</span>
				</h1>

				<p className="mb-8">
					Share your best moment with the world! We take care{" "}
					<span className="text-indigo-500">to store them for you ;)</span>
				</p>

				<div className="flex flex-row w-full justify-center items-center">
					<Link
						href="sign-up"
						className="block px-3 py-2 border border-indigo-500 rounded bg-indigo-500 text-white font-semibold text-center mr-2"
					>
						Get Onboard 🚀
					</Link>

					<Link
						href="sign-in"
						className="block px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white font-semibold text-center"
					>
						Already have an account 😎
					</Link>
				</div>
			</main>

			<footer className="text-center py-4">
				<a
					href="https://github.com/Neosoulink"
					target="_blank"
					rel="noopener noreferrer"
				>
					A funny project - 2022. Made with ❤
				</a>
			</footer>
		</div>
	);
}
