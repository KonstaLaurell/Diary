// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { lightTheme, darkTheme, AppTheme } from "./themes";

type ThemeContextType = {
	isDark: boolean;
	toggleTheme: () => void;
	useSystemTheme: boolean;
	setUseSystemTheme: (value: boolean) => void;
	theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	toggleTheme: () => {},
	useSystemTheme: true,
	setUseSystemTheme: () => {},
	theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const systemColorScheme = useColorScheme();
	const [isDark, setIsDark] = useState(systemColorScheme === "dark");
	const [useSystemTheme, setUseSystemTheme] = useState(true);

	// Load saved theme preferences
	useEffect(() => {
		const loadThemePreferences = async () => {
			try {
				const preferences = await AsyncStorage.getItem(
					"themePreferences"
				);
				if (preferences) {
					const {
						isDark: savedIsDark,
						useSystemTheme: savedUseSystem,
					} = JSON.parse(preferences);
					setIsDark(savedIsDark);
					setUseSystemTheme(savedUseSystem);
				}
			} catch (e) {
				console.error("Failed to load theme preferences", e);
			}
		};

		loadThemePreferences();
	}, []);

	// Update theme when system theme changes (if using system theme)
	useEffect(() => {
		if (useSystemTheme) {
			setIsDark(systemColorScheme === "dark");
		}
	}, [systemColorScheme, useSystemTheme]);

	// Save preferences when they change
	useEffect(() => {
		const saveThemePreferences = async () => {
			try {
				await AsyncStorage.setItem(
					"themePreferences",
					JSON.stringify({
						isDark,
						useSystemTheme,
					})
				);
			} catch (e) {
				console.error("Failed to save theme preferences", e);
			}
		};

		saveThemePreferences();
	}, [isDark, useSystemTheme]);

	const toggleTheme = () => {
		if (useSystemTheme) {
			setUseSystemTheme(false);
		}
		setIsDark(!isDark);
	};

	return (
		<ThemeContext.Provider
			value={{
				isDark,
				toggleTheme,
				useSystemTheme,
				setUseSystemTheme,
				theme: isDark ? darkTheme : lightTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
