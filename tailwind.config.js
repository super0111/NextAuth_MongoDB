const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require('tailwindcss/colors')
const themeConstants = {
	paper: "#F9F9F9",
	primary: {
	  main: "#fff",
	  dark: "#e5e5e5",
	},
	secondary: {
	  main: "#212121",
	  dark: "#4f46e5",
	},
	error: {
	  main: "#b22222",
	  dark: "#8b0000",
	},
	fg: { main: "#fff", dark: "rgba(55, 65, 81, 1)" },
	breakpoints: {
	  xs: "0px",
	  mb: "350px",
	  sm: "600px",
	  md: "960px",
	  lg: "1280px",
	  xl: "1920px",
	},
  };
  
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}'
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
			paper: themeConstants.paper,
			primary: themeConstants.primary,
			secondary: themeConstants.secondary,
			error: themeConstants.error,
			fg: themeConstants.fg.main,
			"fg-dark": themeConstants.fg.dark,
			sky: colors.sky,
			teal: colors.teal,
			rose: colors.rose,
			},
		},
		// We over ride the whole screens with breakpoints for width. The 'ha' breakpoint will help us in blocking hover animations on devices not supporting hover.
		screens: {
			...defaultTheme.screens,
			...themeConstants.breakpoints,
			ha: { raw: "(hover: hover)" },
		  },
	},
	variants: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		

	]
};
