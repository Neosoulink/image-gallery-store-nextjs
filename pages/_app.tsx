import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

// HELPER
import firebase, { NewUserDataInterface } from "../helpers/firebase";

// STYLES
import "../styles/main.css";

export default function MyApp({ Component, pageProps }: AppProps) {
	// ROUTER
	const ROUTER = useRouter();

	// STATES
	const [loading, setLoading] = React.useState(true);

	// EFFECTS
	useEffect(() => {
		firebase.init();

		const onAuthStateChangedUnsubscribe = onAuthStateChanged(
			firebase.auth,
			async (_USER_AUTH) => {
				console.log("state changed", _USER_AUTH, ROUTER);

				if (_USER_AUTH) {
					const USER_DATA = (await firebase.getUserData(
						_USER_AUTH.uid
					)) as NewUserDataInterface;
					console.log(ROUTER);

					if (USER_DATA) {
						// ? If using redux, set user store with these data
						// data: {
						//   name: USER_DATA.name,
						//   email: USER_DATA.email,
						//   deleted: USER_DATA.deleted,
						//   photoURL: USER_DATA.photoURL,
						//   phoneNumber: USER_DATA.phoneNumber,
						//   signUpMethod: USER_DATA.signUpMethod,
						//   uid: _USER_AUTH.uid,
						//   emailVerified: _USER_AUTH.emailVerified,
						//   isAnonymous: _USER_AUTH.isAnonymous,
						//   createdAt: USER_DATA.createdAt.toDate(),
						//   updatedAt: USER_DATA.updatedAt.toDate(),
						// }

						if (["/sign-in", "/sign-up"].includes(ROUTER.asPath)) {
							ROUTER.replace("/profile");
						}
					} else {
						await firebase.signOut();
					}
				} else {
					if (["/profile"].includes(ROUTER.asPath)) {
						ROUTER.replace("/sign-in");
					}
				}

				setLoading(false);
			}
		);

		return () => {
			onAuthStateChangedUnsubscribe();
		};
	}, [ROUTER.asPath]);

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{loading ? (
				<div className="w-screen h-screen flex justify-center items-center">
					<h1 className="font-bold text-3xl">
						loading...
					</h1>
				</div>
			) : (
				<Component {...pageProps} />
			)}
		</>
	);
}
