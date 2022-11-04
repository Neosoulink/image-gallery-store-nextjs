import React from "react";
import Image from "next/image";
import "tui-image-editor/dist/tui-image-editor.css";
// @ts-ignore
import ImageEditor from "@toast-ui/react-image-editor";
import { validate } from "validate.js";

// TYPES
import { ModifyPropertiesTypes } from "types";

// CONSTANTS
import { REQUIRE_NOT_EMPTY_PRESENCE } from "constants/rules.validate";

// HELPERS
import firebase, {
	NewStoredUserPhotoGalleryInterface,
	StoreUserPhotoGalleryFormInterface,
} from "helpers/firebase";

// LOCAL TYPES
export interface Props {
	visible: boolean;
	onDismiss: () => any;
	onCompleteAdd?: (
		newItem: ModifyPropertiesTypes<
			NewStoredUserPhotoGalleryInterface,
			{
				user: string;
			}
		>
	) => any;
}
export type AddPictureFormType = "title" | "description" | "img";
export type FormType = {
	[name in AddPictureFormType]: string | File;
};
export type FormConstraintType = {
	[name in AddPictureFormType]?: object;
};
export type FormErrorsType =
	| {
			[name in AddPictureFormType]: string[] | undefined;
	  }
	| { [name: string]: string[] | undefined };

function AddPictureModal({ visible, onDismiss, onCompleteAdd }: Props) {
	// DATA
	const myTheme = {
		// Theme object to extends default dark theme.
	};
	const INITIAL_FORM = {
		title: "",
		description: "",
		img: undefined,
	};

	// STATES
	const [form, setForm] =
		React.useState<
			ModifyPropertiesTypes<StoreUserPhotoGalleryFormInterface, { img?: File }>
		>(INITIAL_FORM);
	const [formErrors, setFormErrors] = React.useState<FormErrorsType>({});
	const [submitFormLoading, setSubmitFormLoading] =
		React.useState<boolean>(false);
	const [preview, setPreview] = React.useState<undefined | string>();

	// FUNCTIONS
	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormErrors({});
		setSubmitFormLoading(true);

		const FORMATTED_FORM = form;
		const VALIDATION_CONSTRAINT: FormConstraintType = {
			title: REQUIRE_NOT_EMPTY_PRESENCE,
			img: REQUIRE_NOT_EMPTY_PRESENCE,
		};

		const VALIDATION_RESULT = validate(FORMATTED_FORM, VALIDATION_CONSTRAINT);

		if (VALIDATION_RESULT) {
			setFormErrors(VALIDATION_RESULT);
			setSubmitFormLoading(false);
			return false;
		}

		if (!FORMATTED_FORM.img) {
			setFormErrors({
				img: ["Oops! image invalid"],
			});
			return;
		}

		const SIGN_IN_RES = await firebase.storeUserPhotoGallery(
			FORMATTED_FORM as unknown as StoreUserPhotoGalleryFormInterface
		);

		setSubmitFormLoading(false);
		if (!SIGN_IN_RES) {
			setFormErrors({
				email: ["Oops! User not found :("],
			});
			return;
		}

		setForm(INITIAL_FORM);
		onDismiss();
		if (onCompleteAdd) {
			onCompleteAdd(SIGN_IN_RES);
		}
	};

	// EFFECTS
	React.useEffect(() => {
		if (!form.img) {
			setPreview(undefined);
			return;
		}

		const objectUrl = URL.createObjectURL(form.img);
		setPreview(objectUrl);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [form.img]);

	return (
		<div
			className={`w-screen h-screen absolute overflow-hidden z-30 ${
				visible ? "" : "hidden"
			}`}
		>
			<div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
				<button
					className="absolute top-10 right-10 h-10 w-10 bg-white shadow-lg rounded-full z-50 hover:bg-slate-50"
					onClick={onDismiss}
				>
					&#x2716;
				</button>

				<div
					className="absolute w-full h-full bg-black opacity-40"
					onClick={onDismiss}
				/>

				<div className="max-h-screen w-7/12 py-10 z-50 flex">
					<form
						className="w-full p-10 bg-white rounded-md shadow-2xl overflow-y-auto"
						onSubmit={handleFormSubmit}
					>
						<div className="mb-8">
							<h2 className="text-4xl font-bold text-indigo-500 mb-2">
								Add a moment 📷
							</h2>
							<p className="">
								Don't by shy, share with the world your best moment with a
								picture ✨
							</p>
						</div>

						<label className="block mb-4">
							<span className="block text-sm font-medium text-slate-700">
								Title of the capture
							</span>
							<input
								type="text"
								value={form.title}
								className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
									formErrors.title ? "" : "invalid:"
								}border-pink-500 ${
									formErrors.title ? "" : "invalid:"
								}text-pink-600 focus:${
									formErrors.title ? "" : "invalid:"
								}border-pink-500 focus:${formErrors.title ? "" : "invalid:"}`}
								onChange={(e) => setForm({ ...form, title: e.target.value })}
							/>
							<p
								className={`mt-1 ${
									formErrors.title ? "" : "invisible"
								} peer-invalid:visible text-pink-600 text-sm`}
							>
								{formErrors.title
									? formErrors.title[0]
									: "Please provide a valid title address."}
							</p>
						</label>

						<label className="block mb-4">
							<span className="block text-sm font-medium text-slate-700">
								Have a descriptions?
							</span>
							<textarea
								value={form.description}
								className={`peer mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
									formErrors.description ? "" : "invalid:"
								}border-pink-500 ${
									formErrors.description ? "" : "invalid:"
								}text-pink-600 focus:${
									formErrors.description ? "" : "invalid:"
								}border-pink-500 focus:${
									formErrors.description ? "" : "invalid:"
								}`}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							<p
								className={`mt-1 ${
									formErrors.description ? "" : "invisible"
								} peer-invalid:visible text-pink-600 text-sm`}
							>
								{formErrors.description
									? formErrors.description[0]
									: "Please the description field is required."}
							</p>
						</label>

						<label className="block">
							<span className="block text-sm font-medium text-slate-700">
								Select your amazing picture
							</span>
							<span className="sr-only">Choose profile photo</span>
							<input
								type="file"
								className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
									formErrors.img ? "text-danger" : "text-slate-500"
								}`}
								onChange={(e) => {
									if (!e.target.files || e.target.files.length === 0) {
										setForm({ ...form, img: undefined });
										return;
									}

									// I've kept this example simple by using the first image instead of multiple
									setForm({ ...form, img: e.target.files[0] });
									return e;
								}}
							/>
							<p
								className={`mt-1 ${
									formErrors.img ? "" : "invisible"
								} peer-invalid:visible text-pink-600 text-sm`}
							>
								{formErrors.img
									? formErrors.img[0]
									: "Please the image is required."}
							</p>
						</label>

						{form.img && preview && (
							<Image
								src={preview}
								width={150}
								height={150}
								alt={"user photo gallery"}
							/>
						)}

						<button
							disabled={submitFormLoading}
							className="block w-full px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white font-semibold text-center my-5 disabled:bg-indigo-500 disabled:text-white disabled:placeholder-opacity-50"
						>
							{submitFormLoading
								? "Storing your moment. Please wait..."
								: "Store my moment 😎"}
						</button>
					</form>
				</div>

				{false && (
					<ImageEditor
						includeUI={{
							loadImage: {
								path: "img/sampleImage.jpg",
								name: "SampleImage",
							},
							theme: myTheme,
							menu: ["shape", "filter"],
							initMenu: "filter",
							uiSize: {
								width: "1000px",
								height: "700px",
							},
							menuBarPosition: "bottom",
						}}
						cssMaxHeight={500}
						cssMaxWidth={700}
						selectionStyle={{
							cornerSize: 20,
							rotatingPointOffset: 70,
						}}
						usageStatistics={true}
					/>
				)}
			</div>
		</div>
	);
}

export default AddPictureModal;
