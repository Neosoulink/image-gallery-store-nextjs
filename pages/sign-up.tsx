import React from "react";
import Head from "next/head";
import Link from "next/link";

// TYPES
import type { SignUpFormFieldsNameType } from "../helpers/firebase";

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
	[name in SignUpFormFieldsNameType]: string;
};
export type FormConstraintType = {
	[name in SignUpFormFieldsNameType]?: object;
};
export type FormErrorsType =
	| {
			[name in SignUpFormFieldsNameType]: string[] | undefined;
	  }
	| { [name: string]: string[] | undefined };

function SignUp({}: Props) {
	// STATES
	const [form, setForm] = React.useState<FormType>({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
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
			username: REQUIRE_NOT_EMPTY_PRESENCE,
			email: REQUIRE_EMAIL,
			password: {
				...REQUIRE_NOT_EMPTY_PRESENCE,
				length: {
					minimum: 6,
				},
			},
			confirmPassword: {
				equality: "password",
			},
		};

		const VALIDATION_RESULT = validate(FORMATTED_FORM, VALIDATION_CONSTRAINT);

		if (VALIDATION_RESULT) {
			setFormErrors(VALIDATION_RESULT);
			setSubmitFormLoading(false);
			return false;
		}

		const IS_EMAIL_EXIST = await firebase.emailExist(FORMATTED_FORM.email);
		if (IS_EMAIL_EXIST) {
			setFormErrors({
				email: ["Email already exist"],
			});
			setSubmitFormLoading(false);
			return false;
		}

		const SIGN_UP_RES = await firebase.signUp(FORMATTED_FORM);

		if (!SIGN_UP_RES) {
			setFormErrors({
				email: ["Something went wrong"],
			});
		}

		setSubmitFormLoading(false);
	};

	return (
		<div className="h-screen w-screen overflow-hidden flex flex-col">
			<Head>
				<title>IG-Store - Sign Up</title>
			</Head>

			<main className=" overflow-y-auto flex flex-col items-center pt-20 pb-5">
				<form className="w-2/6" onSubmit={handleFormSubmit}>
					<div className="mb-8">
						<h2 className="text-4xl font-bold text-indigo-500 mb-2">Sign Up</h2>
						<p className="">It's a real pleasure to have you here :)</p>
					</div>

					<label className="block mb-4">
						<span className="block text-sm font-medium text-slate-700">
							Your name 😉
						</span>
						<input
							type="text"
							autoComplete="username"
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none ${
								formErrors.username ? "" : "invalid:"
							}border-pink-500 ${
								formErrors.username ? "" : "invalid:"
							}text-pink-600 focus:${
								formErrors.username ? "" : "invalid:"
							}border-pink-500 focus:${
								formErrors.username ? "" : "invalid:"
							}ring-pink-500 `}
							onChange={(e) => setForm({ ...form, username: e.target.value })}
						/>
						<p
							className={`mt-1 ${
								formErrors.username ? "" : "invisible"
							} peer-invalid:visible text-pink-600 text-sm`}
						>
							{formErrors.username
								? formErrors.username[0]
								: "Please the Name field is required."}
						</p>
					</label>

					<label className="block mb-4">
						<span className="block text-sm font-medium text-slate-700">
							Your email 😁
						</span>
						<input
							type="email"
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none ${
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
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none ${
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

					<label className="block mb-4">
						<span className="block text-sm font-medium text-slate-700">
							Confirm your Password 🤯
						</span>
						<input
							type="password"
							autoComplete="new-password"
							className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none ${
								formErrors.confirmPassword ? "" : "invalid:"
							}border-pink-500 ${
								formErrors.confirmPassword ? "" : "invalid:"
							}text-pink-600 focus:${
								formErrors.confirmPassword ? "" : "invalid:"
							}border-pink-500 focus:${
								formErrors.confirmPassword ? "" : "invalid:"
							}`}
							onChange={(e) =>
								setForm({ ...form, confirmPassword: e.target.value })
							}
						/>
						<p
							className={`mt-1 ${
								formErrors.confirmPassword ? "" : "invisible"
							} peer-invalid:visible text-pink-600 text-sm`}
						>
							{formErrors.confirmPassword
								? formErrors.confirmPassword[0]
								: "Please the Password confirmation is required."}
						</p>
					</label>

					<button
						disabled={submitFormLoading}
						className="block w-full px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white font-semibold text-center my-5 disabled:bg-indigo-500 disabled:text-white disabled:placeholder-opacity-50"
					>
						{submitFormLoading ? (
							"Registration processing..."
						) : (
							<>Let me in!!! &rarr;</>
						)}
					</button>

					<div className="text-center">
						<Link href="sign-in" className="hover:underline">
							Already have an account?{" "}
							<span className="text-indigo-500">Sign In</span>
						</Link>
					</div>
				</form>
			</main>
		</div>
	);
}

export default SignUp;
