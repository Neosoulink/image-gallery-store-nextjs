import React from "react";

// LOCAL TYPES
export interface Props {
	visible: boolean;
	onConfirm: () => any;
	onDismiss: () => any;
	confirmationLoading: boolean;
}

function DeletePhotoConfirmationModal({
	visible,
	onDismiss,
	onConfirm,
	confirmationLoading,
}: Props) {
	return (
		<div
			className={`w-screen h-screen absolute overflow-hidden z-30 ${
				visible ? "" : "hidden"
			}`}
		>
			<div className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
				<div className="absolute top-10 right-10 flex flex-col z-50">
					<button
						className="h-10 w-10 bg-white shadow-lg rounded-full  hover:bg-slate-50 mb-2"
						onClick={onDismiss}
					>
						&#x2716;
					</button>
				</div>

				<div
					className="absolute w-full h-full bg-black opacity-40"
					onClick={onDismiss}
				/>

				<div className="max-h-screen w-11/12 sm:w-10/12 md:w-7/12 py-10 z-40 flex">
					<div className="w-full p-10 bg-white rounded-md shadow-2xl overflow-y-auto">
						<div className="mb-8">
							<h2 className="text-4xl font-bold text-indigo-500 mb-2">
								Delete Photo?
							</h2>
							<p className="text-xl">
								Are you really sure to delete this amazing picture?
							</p>
						</div>

						<div className="flex flex-col mt-6">
							<button
								disabled={confirmationLoading}
								className="block w-full px-3 py-2 border border-danger rounded hover:bg-danger hover:text-white font-semibold text-center  disabled:bg-danger disabled:text-white disabled:opacity-50 mb-2"
								onClick={onConfirm}
							>
								{confirmationLoading
									? "Removing your photo..."
									: "Yes! it wasn't so amazing"}
							</button>

							<button
								disabled={confirmationLoading}
								className="block w-full px-3 py-2 border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white font-semibold text-center"
								onClick={onDismiss}
							>
								No! I changed my mind
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeletePhotoConfirmationModal;
