import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

// HELPERS
import firebase, { NewUserDataInterface } from "helpers/firebase";
import { isEmpty } from "helpers/utils";

// COMPONENTS
import AddPictureModal from "@/components/AddPictureModal";

// LOCAL TYPES
export interface Props {}

const Profile: NextPage<Props> = ({}) => {
	// ROUTER
	const router = useRouter();
	const { user } = router.query;

	// STATES
	const [userData, setUserData] = React.useState<
		NewUserDataInterface | undefined
	>(undefined);
	const [loadingUserData, setLoadingUserData] = React.useState(true);
	const [owner, setOwner] = React.useState(false);
	const [showAddPhotoGalleryModal, setShowAddPhotoGalleryModal] =
		React.useState(false);

	// EFFECTS
	React.useEffect(() => {
		(async () => {
			setLoadingUserData(true);
			const CURRENT_FIRE_USER = firebase.auth.currentUser;
			const USER_EMAIL =
				typeof user === "string" && !isEmpty(user)
					? user
					: CURRENT_FIRE_USER?.email;

			if (typeof USER_EMAIL === "string" && !isEmpty(USER_EMAIL)) {
				const GET_USER_DATA = await firebase.getUserDataByEmail(USER_EMAIL);

				if (GET_USER_DATA && GET_USER_DATA.data()) {
					setUserData(GET_USER_DATA.data());
					setOwner(
						!!CURRENT_FIRE_USER &&
							GET_USER_DATA.data()?.email === CURRENT_FIRE_USER.email
					);
				}
			}

			setLoadingUserData(false);
		})();

		return () => {};
	}, []);

	return (
		<>
			<AddPictureModal
				visible={showAddPhotoGalleryModal}
				onDismiss={() => setShowAddPhotoGalleryModal(false)}
			/>
			<div className="w-screen h-screen overflow-hidden flex">
				<div className="w-96 bg-slate-200 shadow-2xl flex flex-col py-16 px-5">
					<div className="h-40 w-40 rounded-full bg-white overflow-hidden mb-5" />

					{loadingUserData ? (
						<div>Loading user info...</div>
					) : (
						<>
							{userData ? (
								<>
									<div className="">
										<h2 className="text-dark-40 font-semibold text-2xl mb-2">
											{userData.name}
										</h2>
										<h2 className="text-dark-40 font-semibold text-xl mb-2">
											{userData.email}
										</h2>
									</div>
									<div className="flex flex-row my-10">
										<div className="flex flex-col items-center flex-1 border-r-2 border-r-dark-40">
											<span className=" font-semibold">Photos</span>
											<span>30</span>
										</div>
										<div className="flex flex-col items-center flex-1 border-r-2">
											<span className=" font-semibold">Likes</span>
											<span>2</span>
										</div>
									</div>{" "}
								</>
							) : (
								<div className="">
									<h2 className="text-dark-40 font-semibold text-2xl mb-2">
										User not found 🤔
									</h2>
								</div>
							)}

							{owner && (
								<>
									<button
										className="border border-indigo-500 rounded p-2 hover:bg-indigo-500 hover:text-white mb-3"
										onClick={() => setShowAddPhotoGalleryModal(true)}
									>
										Upload a moment 📷
									</button>

									<button
										className="border border-danger rounded p-2 hover:bg-danger hover:text-white"
										onClick={() => firebase.signOut()}
									>
										Log out 🚪
									</button>
								</>
							)}
						</>
					)}
				</div>

				<div className="p-5 grid grid-cols-3 gap-4 flex-1 overflow-y-auto">
					{Array.from(Array(30).keys()).map(() => (
						<div className="group relative shadow hover:shadow-xl col-auto h-56 flex items-end rounded overflow-hidden">
							<img src="" className="absolute h-full w-full" />

							<div className=" bg-gradient-to-t from-black opacity-0 group-hover:opacity-20 absolute h-full w-full" />

							<div className="relative opacity-0 group-hover:opacity-100 text-white p-3">
								<h2 className="font-semibold text-base">Title</h2>

								<desc className="font-semibold text-sm">
									Moment description
								</desc>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Profile;
