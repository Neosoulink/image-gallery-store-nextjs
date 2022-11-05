import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

// HELPERS
import firebase, {
	NewStoredUserPhotoGalleryInterface,
	NewUserDataInterface,
} from "helpers/firebase";
import { isEmpty } from "helpers/utils";

// COMPONENTS
import AddPictureModal from "@/components/AddPictureModal";

// LOCAL TYPES
export interface Props {}

const Profile: NextPage<Props> = ({}) => {
	// ROUTER
	const ROUTER = useRouter();
	const { user } = ROUTER.query;

	// STATES
	const [userData, setUserData] = React.useState<
		NewUserDataInterface | undefined
	>(undefined);
	const [loadingUserData, setLoadingUserData] = React.useState(true);
	const [owner, setOwner] = React.useState(false);
	const [showAddPhotoGalleryModal, setShowAddPhotoGalleryModal] =
		React.useState(false);
	const [userImgList, setUserImgList] = React.useState<
		NewStoredUserPhotoGalleryInterface[]
	>([]);

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
					console.log("USER_PHOTOS ===>", GET_USER_DATA.data(), ROUTER.query);
					setUserData(GET_USER_DATA.data());

					setOwner(
						!!CURRENT_FIRE_USER &&
							GET_USER_DATA.data()?.email === CURRENT_FIRE_USER.email
					);

					const USER_PHOTOS = await firebase.getStoredUserPhotoGallery(
						GET_USER_DATA.data()?.id
					);

					setUserImgList(USER_PHOTOS);
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
				onCompleteAdd={(newEntry) =>
					setUserImgList([
						newEntry as unknown as NewStoredUserPhotoGalleryInterface,
						...userImgList,
					])
				}
			/>
			<div className="w-screen h-screen overflow-hidden flex flex-col md:flex-row">
				<div className="w-full md:w-96 bg-slate-200 shadow-2xl flex flex-col py-5 md:py-16 px-5">
					{loadingUserData ? (
						<div>Loading user info...</div>
					) : (
						<>
							{userData ? (
								<div className="flex flex-row md:flex-col">
									<div className="md:mb-10 flex-1 md:flex-initial pr-3">
										<div
											className="h-24 w-24 md:h-40 md:w-40 rounded-full bg-white overflow-hidden mb-5 bg-contain bg-no-repeat bg-center"
											style={{
												backgroundImage:
													"url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqFCpRqRXjxV_7FnE8tv-8zD5oVAG8Mmz2wQ&usqp=CAU)",
											}}
										/>

										<h2 className="text-dark-40 font-semibold text-xl md:text-2xl mb-2">
											{userData.name}
										</h2>
										<h2 className="text-dark-40 font-semibold text-lg md:text-xl mb-2">
											{userData.email}
										</h2>
									</div>

									<div className="flex flex-col flex-1 md:flex-initial justify-center">
										<div className="flex flex-row mb-5 md:mb-10">
											<div className="flex flex-col items-center flex-1 border-r-2 border-r-dark-40">
												<span className=" font-semibold">Photos</span>
												<span>{userImgList.length}</span>
											</div>
											<div className="flex flex-col items-center flex-1 border-r-2">
												<span className=" font-semibold">Likes</span>
												<span>0</span>
											</div>
										</div>

										{owner && (
											<div className="w-full flex flex-col">
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
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="">
									<h2 className="text-dark-40 font-semibold text-2xl mb-2">
										User not found 🤔
									</h2>
								</div>
							)}
						</>
					)}
				</div>

				{!loadingUserData && (
					<>
						{userImgList.length ? (
							<div className="p-5 flex-1 overflow-y-auto">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{userImgList.map((item, index) => (
										<div
											key={index}
											className="group relative shadow hover:shadow-xl col-auto h-56 flex items-end rounded overflow-hidden bg-white"
										>
											<div
												style={{ backgroundImage: `url(${item.img})` }}
												className="absolute h-full w-full bg-cover bg-center"
											/>

											<a
												href={item.img}
												target="_blank"
												className=" bg-gradient-to-t from-black opacity-0 group-hover:opacity-30 absolute h-full w-full"
											/>

											{owner && (
												<div className="absolute top-3 right-3  flex-col items-end hidden group-hover:flex z-10">
													<button className=" bg-indigo-500 text-white text-small py-1 px-2 mb-1 rounded">
														Edit
													</button>
													<button className=" bg-danger text-white text-small py-1 px-2 rounded">
														Delete
													</button>
												</div>
											)}

											<a
												href={item.img}
												target="_blank"
												className="relative opacity-0 group-hover:opacity-100 text-white p-3"
											>
												<h2 className="font-semibold text-base text">
													{item.title}
												</h2>

												<span className="font-semibold text-sm">
													{item.description ?? ""}
												</span>
											</a>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="flex-1 flex items-center justify-center">
								<h2 className="font-bold text-3xl">No picture found 😫</h2>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default Profile;
