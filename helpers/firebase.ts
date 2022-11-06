import { getApps, initializeApp } from "firebase/app";
import {
	Auth,
	createUserWithEmailAndPassword,
	getAuth,
	signInAnonymously,
	signInWithEmailAndPassword,
	signOut as FB_signOut,
	deleteUser,
	updateProfile,
	updateEmail,
	User,
	sendPasswordResetEmail,
} from "firebase/auth";
import {
	DocumentData,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	setDoc,
	query,
	where,
	Firestore,
	Timestamp,
	deleteDoc,
	updateDoc,
	DocumentReference,
	addDoc,
	orderBy,
} from "firebase/firestore";
import {
	getStorage,
	FirebaseStorage,
	ref,
	getDownloadURL,
	uploadBytesResumable,
	UploadMetadata,
} from "firebase/storage";
import { validate } from "validate.js";

// TYPES
import type { ModifyPropertiesTypes } from "../types";

// CONSTANTS
import {
	REQUIRE_EMAIL,
	REQUIRE_NOT_EMPTY_PRESENCE,
	REQUIRE_NUMERIC,
} from "../constants/rules.validate";

// LOCAL TYPES/INTERFACES
export type SignUpFormFieldsNameType =
	| "username"
	| "email"
	| "password"
	| "confirmPassword";

export type SignUpFormType = {
	[name in SignUpFormFieldsNameType]: string;
};

export type SignInFormFieldsNameType = "email" | "password";

export type SignInFormType = {
	[name in SignInFormFieldsNameType]: string;
};

export type editUserDataFormFieldsNameType = "name" | "email" | "photoURL";

export interface editUserDataFormType {
	name: string;
	email: string;
	photoURL: any;
}

export interface NewUserDataInterface {
	id?: string;
	name: string;
	email: string;
	phoneNumber: string;
	photoURL: string;
	signUpMethod: string;
	deleted: boolean;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface editUserDataResInterface
	extends ModifyPropertiesTypes<editUserDataFormType, { photoURL: string }> {}

export interface StoreUserPhotoGalleryFormInterface {
	img: string;
	title: string;
	description?: string;
}

export interface NewStoredUserPhotoGalleryInterface {
	id: string | null;
	img: string;
	user: DocumentReference;
	title: string;
	description: string | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

// LOCAL FORMS VALIDATION CONSTRAINTS
export const _EDIT_USER_DATA_VALIDATION_CONSTRAINT: {
	[name in editUserDataFormFieldsNameType]: object;
} = {
	name: { ...REQUIRE_NOT_EMPTY_PRESENCE },
	email: { ...REQUIRE_EMAIL },
	photoURL: {},
};

/**
 * Firebase helper class
 */
class FirebaseHelper {
	constructor() {
		this.init();
		this.checkAuth();
	}

	/**
	 * Init firebase app
	 *
	 * @returns void
	 */
	init = () => {
		if (!getApps().length) {
			initializeApp({
				apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONF_API_KEY,
				authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONF_AUTH_DOMAIN,
				projectId: process.env.NEXT_PUBLIC_FIREBASE_CONF_PROJECT_ID,
				storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONF_STORAGE_BUCKET,
				messagingSenderId:
					process.env.NEXT_PUBLIC_FIREBASE_CONF_MESSAGING_SENDER_ID,
				appId: process.env.NEXT_PUBLIC_FIREBASE_CONF_APP_ID,
				measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONF_MEASUREMENT_ID,
			});
		}
	};

	/**
	 * Check if user is already authenticated
	 * and sign him automatically
	 *
	 * @returns void
	 */
	checkAuth = () => {
		this.auth.onAuthStateChanged((user) => {
			if (!user && user != null) {
				signInAnonymously(user);
			}
		});
	};

	/**
	 * Verify if user email already exist
	 *
	 * @param email user email
	 */
	async emailExist(email: string) {
		try {
			const QUERY = query(
				collection(this.db, "users"),
				where("email", "==", email)
			);

			const DATA = await getDocs(QUERY);
			return !DATA.empty;
		} catch (err) {
			console.warn("🚧 FirebaseHelper->emailExist->catch", err);
		}

		return false;
	}

	/**
	 * Verify if user exist in DB
	 *
	 * @param uid user uid
	 */
	async userDataExist(uid: string) {
		const _USER_DOC_REF = doc(this.db, "users", uid);
		try {
			const DATA = await getDoc(_USER_DOC_REF);
			return DATA.exists();
		} catch (err) {
			console.warn("🚧 FirebaseHelper->userDataExist->catch", err);
		}

		return false;
	}

	/**
	 * Sign-up user and sign-in user
	 *
	 * @param form ``SignUpFormType`` object that contain new user data
	 */
	async signUp(form: SignUpFormType): Promise<boolean> {
		const _VALIDATION_CONSTRAINT = {
			username: REQUIRE_NOT_EMPTY_PRESENCE,
			email: REQUIRE_EMAIL,
			password: {
				...REQUIRE_NOT_EMPTY_PRESENCE,
				length: {
					minimum: 6,
				},
			},
			amount: REQUIRE_NUMERIC,
			confirmPassword: {
				equality: "password",
			},
		};

		const _VALIDATION_RESULT = validate(form, _VALIDATION_CONSTRAINT);

		if (_VALIDATION_RESULT) {
			const _ERR_KEYS: string[] = [];
			Object.keys(_VALIDATION_RESULT).map((key) => _ERR_KEYS.push(key));

			console.warn({
				type: "danger",
				message: _ERR_KEYS[0],
				description: _VALIDATION_RESULT[_ERR_KEYS[0]][0],
			});

			return false;
		}

		try {
			const _USER_CREDENTIALS = await createUserWithEmailAndPassword(
				this.auth,
				form.email,
				form.password
			);

			if (_USER_CREDENTIALS.user) {
				const _USER_DOC_REF = doc(this.db, "users", _USER_CREDENTIALS.user.uid);

				const _NEW_USER_DATA: NewUserDataInterface = {
					id: _USER_CREDENTIALS.user.uid,
					email: form.email,
					name: form.username,
					photoURL: _USER_CREDENTIALS.user.photoURL || "",
					phoneNumber: _USER_CREDENTIALS.user.phoneNumber || "",
					signUpMethod: "EmailAndPassword",
					deleted: false,
					createdAt: Timestamp.now(),
					updatedAt: Timestamp.now(),
				};

				await setDoc(_USER_DOC_REF, _NEW_USER_DATA);

				// console.warn({
				// 	type: 'success',
				// 	message: '🎉 Sign up successfully',
				// });

				return this.signIn(form);
			}
		} catch (err) {
			console.warn("🚧 FirebaseHelper->signUp->catch", err);
			console.warn({
				type: "danger",
				message: "Something went wrong",
			});
		}

		return false;
	}

	/**
	 * Sign in user
	 *
	 * @param form
	 */
	async signIn(
		form: SignInFormType,
		showSuccessMessage: boolean = true
	): Promise<boolean> {
		try {
			const _USER_CREDENTIAL = await signInWithEmailAndPassword(
				this.auth,
				form.email,
				form.password
			);

			if (_USER_CREDENTIAL.user) {
				if (await this.userDataExist(_USER_CREDENTIAL.user.uid)) {
					showSuccessMessage &&
						console.log({
							type: "success",
							message: "🎉 Connected successfully",
						});
					return true;
				}
				console.warn({
					type: "danger",
					message: "🤔 It's seen like you don't exist in our system",
					duration: 3500,
				});
			}
		} catch (err) {
			console.warn("🚧 FirebaseHelper->signIn->catch", err);
		}

		return false;
	}

	/**
	 * Sign out user
	 *
	 * @returns Promise<boolean>
	 */
	async signOut(): Promise<void> {
		return await FB_signOut(this.auth);
	}

	/**
	 * Delete user account
	 *
	 * @returns Promise<boolean>
	 */
	async deleteUserAccount(): Promise<boolean | void> {
		try {
			if (this.auth.currentUser) {
				const _USER_DOC_REF = doc(this.db, "users", this.uid ?? "");

				await deleteDoc(_USER_DOC_REF);
				await deleteUser(this.auth.currentUser);

				console.warn({
					type: "info",
					message: "Your account was deleted!",
					icon: "success",
				});
			}
		} catch (err) {
			console.warn("🚧 FirebaseHelper->deleteUserAccount->catch", err);
		}
		return false;
	}

	/**
	 * Get user goal document with the user uid
	 *
	 * @param uid
	 */
	async getUserData(uid: string): Promise<DocumentData | null> {
		try {
			const docRef = doc(this.db, "users", uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return docSnap.data();
			}
		} catch (err) {
			console.warn("🚧 FirebaseHelper->getUser->catch", err);
		}

		return null;
	}

	/**
	 * Get user goal document with the user uid
	 *
	 * @param uid
	 */
	async getUserDataByEmail(email: string): Promise<DocumentData | null> {
		try {
			const QUERY = query(
				collection(this.db, "users"),
				where("email", "==", email)
			);

			const DATA = await getDocs(QUERY);

			if (!DATA.empty) {
				return DATA.docs[0];
			}
		} catch (err) {
			console.warn("🚧 FirebaseHelper->getUser->catch", err);
		}

		return null;
	}

	/**  */
	async editUserData(
		_form: editUserDataFormType
	): Promise<editUserDataResInterface | null> {
		try {
			const _CURRENT_USER = this.auth.currentUser as User;

			const _VALIDATION_RESULT = validate(_form, {
				..._EDIT_USER_DATA_VALIDATION_CONSTRAINT,
			});
			if (_VALIDATION_RESULT) {
				const _ERR_KEYS: string[] = [];
				Object.keys(_VALIDATION_RESULT).map((key) => _ERR_KEYS.push(key));

				console.warn({
					type: "danger",
					message: _ERR_KEYS[0],
					description: _VALIDATION_RESULT[_ERR_KEYS[0]][0],
				});

				return null;
			}

			let newPhotoUrlPath = _CURRENT_USER?.photoURL || "";

			if (_form.email !== _CURRENT_USER.email && _form.email !== null) {
				const IS_EMAIL_EXIST = await this.emailExist(_form.email);
				if (IS_EMAIL_EXIST) {
					console.warn({
						icon: "danger",
						type: "warning",
						message: "Email already exist",
					});
					return null;
				}
			}

			if (_form?.photoURL) {
				newPhotoUrlPath = await this.uploadUserPhotoAsync(
					_form?.photoURL,
					_CURRENT_USER?.uid || ""
				);
			}

			const _DATA_TO_RETURN: editUserDataResInterface = {
				..._form,
				photoURL: newPhotoUrlPath,
			};

			await updateEmail(_CURRENT_USER, _DATA_TO_RETURN.email);

			await updateProfile(_CURRENT_USER, {
				displayName: _form.name,
				photoURL: newPhotoUrlPath,
			});

			const _USERS_REF = doc(this.db, "users", _CURRENT_USER.uid);

			await updateDoc(_USERS_REF, {
				name: _DATA_TO_RETURN.name,
				email: _DATA_TO_RETURN.email,
				photoURL: _DATA_TO_RETURN.photoURL,
				updatedAt: new Date(),
			});

			console.log({
				icon: "success",
				type: "success",
				message: "Data updated",
			});

			return _DATA_TO_RETURN;
		} catch (err: any) {
			console.warn("🚧 FirebaseHelper->editUserData->catch", err.message);
			console.warn({
				type: "danger",
				message: (err.message as string).replace(/Firebase: /, ""),
				duration: 6000,
			});
		}
		return null;
	}

	/**
	 *
	 * @param uri {any} Photo picked
	 * @param path_filename {string}
	 * @param metaData {UploadMetadata}
	 * @returns {Promise<Promise<string>>}
	 */
	async uploadPhotoAsync(
		uri: any,
		path_filename: string,
		metaData: UploadMetadata = {
			contentType: "image/jpeg",
		}
	): Promise<Promise<string>> {
		const _FETCH_RES = await fetch(uri);
		const _FILE = await _FETCH_RES.blob();
		const _STORAGE_REF = ref(this.storage, path_filename);

		const uploadTask = uploadBytesResumable(_STORAGE_REF, _FILE, metaData);

		return new Promise(async (res, rej) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					// Get task progress, including the number of
					// bytes uploaded and the total number of bytes to be uploaded
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
					}
				},
				(error) => {
					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {
						case "storage/unauthorized":
							// User doesn't have permission to access the object
							break;
						case "storage/canceled":
							// User canceled the upload
							break;

						// ...

						case "storage/unknown":
							// Unknown error occurred, inspect error.serverResponse
							break;
					}
					console.log(error.code);
					rej(error.code);
				},
				() => {
					// Upload completed successfully, now we can get the download URL
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						res(downloadURL);

						console.log("File available at", downloadURL);
					});
				}
			);
		});
	}

	/**
	 *
	 * @param uri {any} Photo picked
	 * @param filename {string}
	 * @returns {Promise<Promise<string>>}
	 */
	async uploadUserPhotoAsync(
		uri: any,
		filename: string
	): Promise<Promise<string>> {
		return this.uploadPhotoAsync(uri, "images/usersPhotoUrls/" + filename);
	}

	async resetUserPass(
		email: string = this.auth.currentUser?.email as string
	): Promise<boolean> {
		try {
			await sendPasswordResetEmail(this.auth, email);

			console.log({
				type: "info",
				message:
					"We've sent you an email to reset your password. Please verify your mail box",
				duration: 6000,
			});
			return true;
		} catch (err) {
			console.warn("🚧 FirebaseHelper->resetUserPass->catch", err);
			return false;
		}
	}

	async storeUserPhotoGallery(
		form: StoreUserPhotoGalleryFormInterface
	): Promise<ModifyPropertiesTypes<
		NewStoredUserPhotoGalleryInterface,
		{ user: string }
	> | null> {
		try {
			const _CURRENT_USER = this.auth.currentUser as User;
			const _USER_DOC_REF = doc(this.db, "users", _CURRENT_USER.uid);
			const IMG_NAME =
				Timestamp.now().nanoseconds.toString() + _CURRENT_USER.uid ?? "";

			const NEW_INCOME_SOURCE_ICON = await this.uploadPhotoAsync(
				form.img,
				"images/users_photo_gallery/" + IMG_NAME
			);

			const _DATA_TO_RETURN: NewStoredUserPhotoGalleryInterface = {
				user: _USER_DOC_REF,
				title: form.title,
				description: form.description ?? null,
				img: NEW_INCOME_SOURCE_ICON,
				id: null,
				createdAt: Timestamp.now(),
				updatedAt: Timestamp.now(),
			};

			const _DOC_REF = await addDoc(
				collection(this.db, "users_photo_gallery"),
				_DATA_TO_RETURN
			);

			console.log({
				type: "success",
				icon: "success",
				message: "Income source icon added!",
			});

			_DATA_TO_RETURN.id = _DOC_REF.id;

			return { ..._DATA_TO_RETURN, user: _CURRENT_USER.uid };
		} catch (err) {
			console.warn("🚧 FirebaseHelper->addUserIncomeSourceIcon->catch", err);
		}
		return null;
	}

	async getStoredUserPhotoGallery(
		uid: string
	): Promise<NewStoredUserPhotoGalleryInterface[]> {
		try {
			const USER_REF = doc(this.db, "users", uid);
			const QUERY = query(
				collection(this.db, "users_photo_gallery"),
				where("user", "==", USER_REF),
				orderBy("createdAt", "desc")
			);
			const _ITEMS: NewStoredUserPhotoGalleryInterface[] = [];
			const _DATA = await getDocs(QUERY);

			if (!_DATA.empty) {
				_DATA.docs.forEach((_doc) =>
					_ITEMS.push({
						...(_doc.data() as NewStoredUserPhotoGalleryInterface),
						id: _doc.id,
					})
				);
			}
			return _ITEMS;
		} catch (err) {
			console.warn("🚧 FirebaseHelper->getStoredUserPhotoGallery->catch", err);
		}

		return [];
	}

	/**
	 * Passe ``Firestore`` timestamp fields to return
	 * a dynamic ``Firestore Timestamp`` instance
	 *
	 * @param {number} seconds
	 * @param {number} nanoseconds
	 *
	 * @returns {Timestamp}
	 */
	timestamp(seconds: number, nanoseconds: number): Timestamp {
		return new Timestamp(seconds, nanoseconds);
	}

	/**
	 * Getter that simply return a Firestore instance
	 * @returns {Firestore}
	 */
	get db(): Firestore {
		return getFirestore();
	}

	/**
	 * Getter that simply return a Firestore instance
	 * @returns {Firestore}
	 */
	get storage(): FirebaseStorage {
		return getStorage();
	}

	/**
	 * Get a Auth instance
	 *
	 * @returns {Auth}
	 */
	get auth(): Auth {
		return getAuth();
	}

	/**
	 * Return uid of current authenticate user
	 *
	 * @returns string
	 */
	get uid() {
		return (this.auth.currentUser || {}).uid;
	}
}

export default new FirebaseHelper();
