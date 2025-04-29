import React from "react";
import { View, Text, Button, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/context/themes";
import { Alert } from "react-native";
export default function SettingsScreen() {
	const { isDark, toggleTheme, useSystemTheme, setUseSystemTheme } =
		useTheme();
	const theme = isDark ? darkTheme : lightTheme;

	// Clear diary entries with confirmation
	const clearEntries = async () => {
		Alert.alert(
			"Confirm Clear Entries",
			"Are you sure you want to clear all diary entries?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Yes, Clear",
					onPress: async () => {
						await AsyncStorage.removeItem("diaryEntries");
						alert("Diary entries cleared!");
					},
				},
			],
			{ cancelable: false }
		);
	};

	const resetApp = async () => {
		Alert.alert(
			"Confirm Reset",
			"Are you sure you want to reset the app and clear all data?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Yes, Reset",
					onPress: async () => {
						await AsyncStorage.clear();
						alert("App reset and all data cleared!");
					},
				},
			],
			{ cancelable: false }
		);
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			padding: 20,
			backgroundColor: theme.colors.background,
		},
		header: {
			fontSize: 22,
			fontWeight: "bold",
			marginBottom: 20,
			textAlign: "center",
			color: theme.colors.text,
		},
		settingItem: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 15,
			paddingVertical: 8,
		},
		settingLabel: {
			fontSize: 18,
			color: theme.colors.text,
		},
		switch: {
			transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
		},
		footer: {
			textAlign: "center",
			marginTop: 20,
			color: theme.colors.border,
		},
		section: {
			marginBottom: 25,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.border,
			paddingBottom: 15,
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: theme.colors.primary,
			marginBottom: 15,
		},
		buttonContainer: {
			marginVertical: 8,
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Settings</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Appearance</Text>

				<View style={styles.settingItem}>
					<Text style={styles.settingLabel}>Use System Theme</Text>
					<Switch
						value={useSystemTheme}
						onValueChange={(value) => setUseSystemTheme(value)}
						trackColor={{
							false: "#767577",
							true: isDark ? "#3700B3" : "#81b0ff",
						}}
						thumbColor={
							useSystemTheme
								? isDark
									? "#bb86fc"
									: "#6200ee"
								: "#f4f3f4"
						}
					/>
				</View>

				{!useSystemTheme && (
					<View style={styles.settingItem}>
						<Text style={styles.settingLabel}>Dark Mode</Text>
						<Switch
							value={isDark}
							onValueChange={toggleTheme}
							trackColor={{
								false: "#767577",
								true: isDark ? "#3700B3" : "#81b0ff",
							}}
							thumbColor={isDark ? "#bb86fc" : "#6200ee"}
						/>
					</View>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Data Management</Text>

				<View style={styles.buttonContainer}>
					<Button
						title="Clear All Diary Entries"
						color={isDark ? "red" : "red"}
						onPress={clearEntries}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						title="Reset App"
						color={isDark ? "gray" : "gray"}
						onPress={resetApp}
					/>
				</View>
			</View>

			<Text style={styles.footer}>More settings will be added soon!</Text>
		</View>
	);
}
