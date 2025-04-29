import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// Light theme with more colors
export const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "#6200ee",
		background: "#ffffff",
		card: "#f0f0f0",
		text: "#121212",
		border: "#e0e0e0",
		header: "#121212",
		inputBackground: "#ffffff",
		inputBorder: "#ccc",
		button: "#007AFF",
		buttonText: "#ffffff",
		modalOverlay: "rgba(0,0,0,0.3)",
		modalBackground: "#ffffff",
		placeholder: "#888",
		mutedText: "#888",
		overlay: "rgba(0,0,0,0.3)",
	},
};

// Dark theme with more colors (Discord-like background)
export const darkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: "#bb86fc",
		background: "#2f3136", // Discord-like dark gray background
		card: "#3a3c42", // Slightly lighter card background
		text: "#dcddde", // Light gray text for readability
		border: "#444444", // Softer border
		header: "#ffffff", // White header for contrast
		inputBackground: "#2d2d2d",
		inputBorder: "#444", // Lighter input border
		button: "#3700B3",
		buttonText: "#ffffff",
		modalOverlay: "rgba(0,0,0,0.7)",
		modalBackground: "#2f3136", // Consistent modal background
		placeholder: "#888",
		mutedText: "#888",
		overlay: "rgba(0,0,0,0.7)",
	},
};

// Define type for the theme
export type AppTheme = typeof lightTheme;
