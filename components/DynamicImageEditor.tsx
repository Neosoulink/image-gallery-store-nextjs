import React from "react";
import "tui-image-editor/dist/tui-image-editor.css";
// @ts-ignore
import ImageEditor from "@toast-ui/react-image-editor";

export default function FormEditor({
	imgPath,
	onRef,
}: {
	imgPath: string;
	onRef?: (arg0: ImageEditor) => any;
}) {
	// DATA
	const THEME = {
		"common.bi.image": "",
		"common.bisize.width": "0px",
		"common.bisize.height": "0px",
		"common.backgroundImage": "none",
		"common.backgroundColor": "#1e1e1e",
		"common.border": "0px",

		// header
		"header.backgroundImage": "none",
		"header.backgroundColor": "transparent",
		"header.border": "0px",

		// load button
		"loadButton.backgroundColor": "#fff",
		"loadButton.border": "1px solid #ddd",
		"loadButton.color": "#222",
		"loadButton.fontFamily": "'Noto Sans', sans-serif",
		"loadButton.fontSize": "12px",

		// download button
		"downloadButton.backgroundColor": "#6366F1",
		"downloadButton.border": "1px solid #6366F1",
		"downloadButton.color": "#fff",
		"downloadButton.fontFamily": "'Noto Sans', sans-serif",
		"downloadButton.fontSize": "12px",

		// main icons
		"menu.normalIcon.color": "#8a8a8a",
		"menu.activeIcon.color": "#555555",
		"menu.disabledIcon.color": "#434343",
		"menu.hoverIcon.color": "#e9e9e9",

		// submenu icons
		"submenu.normalIcon.color": "#8a8a8a",
		"submenu.activeIcon.color": "#e9e9e9",

		"menu.iconSize.width": "24px",
		"menu.iconSize.height": "24px",

		"submenu.iconSize.width": "32px",
		"submenu.iconSize.height": "32px",

		// submenu primary color
		"submenu.backgroundColor": "#1e1e1e",
		"submenu.partition.color": "#3c3c3c",

		// submenu labels
		"submenu.normalLabel.color": "#8a8a8a",
		"submenu.normalLabel.fontWeight": "lighter",
		"submenu.activeLabel.color": "#fff",
		"submenu.activeLabel.fontWeight": "lighter",

		// checkbox style
		"checkbox.border": "0px",
		"checkbox.backgroundColor": "#fff",

		// range style
		"range.pointer.color": "#fff",
		"range.bar.color": "#666",
		"range.subbar.color": "#d1d1d1",

		"range.disabledPointer.color": "#414141",
		"range.disabledBar.color": "#282828",
		"range.disabledSubbar.color": "#414141",

		"range.value.color": "#fff",
		"range.value.fontWeight": "lighter",
		"range.value.fontSize": "11px",
		"range.value.border": "1px solid #353535",
		"range.value.backgroundColor": "#151515",
		"range.title.color": "#fff",
		"range.title.fontWeight": "lighter",

		// colorpicker style
		"colorpicker.button.border": "1px solid #1e1e1e",
		"colorpicker.title.color": "#fff",
	};

	// REFS
	const editorRef = React.createRef<ImageEditor>();

	// EFFECTS
	React.useEffect(() => {
		if (typeof onRef === "function") {
			onRef(editorRef.current.getInstance());
		}
	}, []);

	return (
		<ImageEditor
			ref={editorRef}
			includeUI={{
				loadImage: {
					path: imgPath,
					name: "imgToEdit",
				},
				theme: THEME,
				menu: [
					"crop",
					"flip",
					"rotate",
					"draw",
					"shape",
					"icon",
					"text",
					"mask",
					"filter",
				],
				initMenu: "filter",
				uiSize: {
					width: "1000px",
					height: "700px",
				},
				menuBarPosition: "right",
			}}
			cssMaxHeight={500}
			cssMaxWidth={700}
			selectionStyle={{
				cornerSize: 20,
				rotatingPointOffset: 70,
			}}
			usageStatistics={true}
		/>
	);
}
