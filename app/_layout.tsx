// app/_layout.tsx
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThemeProvider } from "@/context/ThemeContext"; // We'll create this
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import { useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/context/themes";

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) return null;

	return (
		<ThemeProvider>
			<InnerLayout />
		</ThemeProvider>
	);
}

const InnerLayout = () => {
	const { isDark } = useTheme();
	return (
		<NavigationThemeProvider value={isDark ? darkTheme : lightTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
		</NavigationThemeProvider>
	);
};

