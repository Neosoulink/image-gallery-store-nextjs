import React from "react";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";

// TYPES
import type { SignInFormFieldsNameType } from "../helpers/firebase";

// CONSTANTS
import {
	REQUIRE_EMAIL,
	REQUIRE_NOT_EMPTY_PRESENCE,
} from "../constants/rules.validate";

// HELPERS
import firebase from "../helpers/firebase";
import { validate } from "validate.js";

// LOCAL TYPES
export interface Props {}
export type FormType = {
	[name in SignInFormFieldsNameType]: string;
};
export type FormConstraintType = {
	[name in SignInFormFieldsNameType]?: object;
};
export type FormErrorsType =
	| {
			[name in SignInFormFieldsNameType]: string[] | undefined;
	  }
	| { [name: string]: string[] | undefined };

const SignIn: NextPage<Props> = ({}) => {
	// STATES
	const [form, setForm] = React.useState<FormType>({
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = React.useState<FormErrorsType>({});
	const [submitFormLoading, setSubmitFormLoading] =
		React.useState<boolean>(false);

	// FUNCTIONS
	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormErrors({});
		setSubmitFormLoading(true);

		const FORMATTED_FORM = form;
		const VALIDATION_CONSTRAINT: FormConstraintType = {
			email: REQUIRE_EMAIL,
			password: {
				...REQUIRE_NOT_EMPTY_PRESENCE,
				length: {
					minimum: 6,
				},
			},
		};

		const VALIDATION_RESULT = validate(FORMATTED_FORM, VALIDATION_CONSTRAINT);

		if (VALIDATION_RESULT) {
			setFormErrors(VALIDATION_RESULT);
			setSubmitFormLoading(false);
			return false;
		}

		const SIGN_IN_RES = await firebase.signIn(FORMATTED_FORM);

		if (!SIGN_IN_RES) {
			setFormErrors({
				email: ["Oops! User not found :("],
			});
		}

		setSubmitFormLoading(false);
	};

	return (
		<div className="h-screen w-screen overflow-hidden flex flex-col">
			<Head>
				<title>IG-Store - Sign In</title>
			</Head>

			<main className=" overflow-y-auto flex flex-col items-center pt-20 pb-5">
				<form
					className="w-full px-5 sm:w-5/6 md:w-3/6 lg:w-6/12 xl:w-2/6"
					onSubmit={handleFormSubmit}
				>
					<div className="mb-8">
						<h2 className="text-4xl font-bold text-indigo-500 mb-2">Sign In</h2>
						<p className="">
							Welcome back, we're very happy to see you here ;)
						</p>
					</div>

					<label className="block mb-4">
						<span className="block text-sm font-medium text-slate-700">
							Your email 😁
						</span>
						<input
							type="email"
							autoComplete="email"
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
								formErrors.email ? "" : "invalid:"
							}border-pink-500 ${
								formErrors.email ? "" : "invalid:"
							}text-pink-600 focus:${
								formErrors.email ? "" : "invalid:"
							}border-pink-500 focus:${formErrors.email ? "" : "invalid:"}`}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
						<p
							className={`mt-1 ${
								formErrors.email ? "" : "invisible"
							} peer-invalid:visible text-pink-600 text-sm`}
						>
							{formErrors.email
								? formErrors.email[0]
								: "Please provide a valid email address."}
						</p>
					</label>

					<label className="block mb-4">
						<span className="block text-sm font-medium text-slate-700">
							Your Password 😎
						</span>
						<input
							type="password"
							autoComplete="new-password"
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
								formErrors.password ? "" : "invalid:"
							}border-pink-500 ${
								formErrors.password ? "" : "invalid:"
							}text-pink-600 focus:${
								formErrors.password ? "" : "invalid:"
							}border-pink-500 focus:${formErrors.password ? "" : "invalid:"}`}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
						/>
						<p
							className={`mt-1 ${
								formErrors.password ? "" : "invisible"
							} peer-invalid:visible text-pink-600 text-sm`}
						>
							{formErrors.password
								? formErrors.password[0]
								: "Please the Password field is required."}
						</p>
					</label>

					<button
						disabled={submitFormLoading}
						className="block w-full px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white font-semibold text-center my-5 disabled:bg-indigo-500 disabled:text-white disabled:placeholder-opacity-50"
					>
						{submitFormLoading ? "Please wait..." : <>Let me in!!! &rarr;</>}
					</button>

					<div className="text-center">
						<Link href="sign-up" className="hover:underline">
							Don't have an account?{" "}
							<span className="text-indigo-500">Sign Up</span>
						</Link>{" "}
						|{" "}
						<Link href="reset-password" className="hover:underline">
							Forgot password?{" "}
							<span className="text-indigo-500">Reset password</span>
						</Link>
					</div>
				</form>
			</main>
		</div>
	);
};

export default SignIn;
