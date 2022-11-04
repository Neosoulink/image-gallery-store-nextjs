import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

// HELPER
import FirebaseHelper from "../helpers/firebase";

// STYLES
import "../styles/main.css";

export default function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		FirebaseHelper.init();

		return () => {};
	}, []);

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}
