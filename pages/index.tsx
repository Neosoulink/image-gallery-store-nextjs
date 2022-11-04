import Head from "next/head";

export default function Home() {
	return (
		<div className="h-screen w-screen overflow-hidden flex flex-col">
			<Head>
				<title>IG-Store - Home</title>
			</Head>

			<main className="flex flex-col flex-1 items-center w-full pt-20 pb-5 overflow-y-auto">
				<h1 className="font-bold text-6xl mb-4">
					Welcome to <span className="text-indigo-500">Stored</span>
				</h1>

				<p className="mb-8">
					Share your best moment with the world! We take care{" "}
					<span className="text-indigo-500">to store them for you ;)</span>
				</p>

				<form className="w-2/6">
					<h2 className="text-xl font-semibold mb-5 text-indigo-500">
						Sign Up
					</h2>

					<label className="block ">
						<span className="block text-sm font-medium text-slate-700">
							Your name 😉
						</span>
						<input
							type="email"
							className="peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
						/>
						<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
							Please provide a valid email address.
						</p>
					</label>

					<label className="block ">
						<span className="block text-sm font-medium text-slate-700">
							Your email 😁
						</span>
						<input
							type="email"
							className="peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
						/>
						<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
							Please provide a valid email address.
						</p>
					</label>

					<label className="block ">
						<span className="block text-sm font-medium text-slate-700">
							Your Password 😎
						</span>
						<input
							type="email"
							className="peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
						/>
						<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
							Please provide a valid email address.
						</p>
					</label>

					<label className="block ">
						<span className="block text-sm font-medium text-slate-700">
							Confirm your Password 🤯
						</span>
						<input
							type="email"
							className="peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
						/>
						<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
							Please provide a valid email address.
						</p>
					</label>

					<button className="block w-full px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500  hover:text-white font-semibold text-center">
						Let me in!!! &rarr;
					</button>
				</form>
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
