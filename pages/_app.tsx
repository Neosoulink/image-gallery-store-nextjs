import type { AppProps } from "next/app";

// STYLES
import "../styles/main.css";

export default function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
