/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				black: "#000000",
				white: "#ffffff",
				transparent: "transparent",
				dark: {
					30: "#AEAEB2",
					40: "#636366",
					60: "#1C1C1E",
					90: "#242334",
				},
				orange: "#FF9500",
				danger: "#ea4449",
			},
		},
	},
	plugins: [],
};
