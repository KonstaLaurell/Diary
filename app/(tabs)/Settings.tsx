import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Button,
	StyleSheet,
	Switch,
	TextInput,
	Alert,
	ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/context/themes";

export default function SettingsScreen() {
	const { isDark, toggleTheme, useSystemTheme, setUseSystemTheme } =
		useTheme();
	const theme = isDark ? darkTheme : lightTheme;

	const [name, setName] = useState("");
	const [pin, setPin] = useState("");
	const [newPin, setNewPin] = useState("");
	const [newName, setNewName] = useState("");

	useEffect(() => {
		loadUserData();
	}, []);

	const loadUserData = async () => {
		try {
			const savedName = await AsyncStorage.getItem("user_name");
			if (savedName) setName(savedName);

			const storedPin = await SecureStore.getItemAsync("user_pin");
			if (storedPin) setPin(storedPin);
		} catch (error) {
			console.error("Failed to load user data:", error);
			Alert.alert("Error", "Failed to load user settings");
		}
	};

	const handleChangeName = async () => {
		try {
			if (!newName.trim()) {
				Alert.alert("Name cannot be empty!");
				return;
			}
			await AsyncStorage.setItem("user_name", newName.trim());
			setName(newName.trim());
			setNewName("");
			Alert.alert("Name updated successfully!");
		} catch (error) {
			console.error("Name update error:", error);
			Alert.alert("Error", "Failed to update name");
		}
	};

	const handleChangePin = async () => {
		try {
			if (newPin.length < 4) {
				Alert.alert("PIN too short", "Please enter at least 4 digits");
				return;
			}
			await SecureStore.setItemAsync("user_pin", newPin);
			setPin(newPin);
			setNewPin("");
			Alert.alert("PIN updated successfully!");
		} catch (error) {
			console.error("PIN update error:", error);
			Alert.alert("Error", "Failed to update PIN");
		}
	};

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
						try {
							await AsyncStorage.removeItem("diaryEntries");
							Alert.alert("Success", "Diary entries cleared!");
						} catch (error) {
							console.error("Clear entries error:", error);
							Alert.alert("Error", "Failed to clear entries");
						}
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
						try {
							await AsyncStorage.clear();
							await SecureStore.deleteItemAsync("user_pin");
							Alert.alert(
								"Success",
								"App reset and all data cleared!"
							);
						} catch (error) {
							console.error("Reset error:", error);
							Alert.alert("Error", "Failed to reset app");
						}
					},
				},
			],
			{ cancelable: false }
		);
	};
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		scrollContainer: {
			padding: 20,
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
			marginBottom: 40,
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
		input: {
			borderWidth: 1,
			borderColor: theme.colors.inputBorder,
			backgroundColor: theme.colors.inputBackground,
			color: theme.colors.text,
			borderRadius: 12,
			padding: 14,
			marginBottom: 20,
			fontSize: 18,
		},
	});

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollContainer}
			keyboardShouldPersistTaps="handled">
			<Text style={styles.header}>Settings</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Profile</Text>

				<Text style={styles.settingLabel}>Current Name</Text>
				<Text
					style={{
						fontSize: 18,
						color: theme.colors.text,
						marginBottom: 10,
					}}>
					{name || "No name set"}
				</Text>

				<TextInput
					style={styles.input}
					placeholder="Enter new name"
					placeholderTextColor={theme.colors.placeholder}
					value={newName}
					onChangeText={setNewName}
				/>
				<View style={styles.buttonContainer}>
					<Button
						title="Change Name"
						onPress={handleChangeName}
						color={theme.colors.primary}
					/>
				</View>

				<Text style={styles.settingLabel}>Current PIN</Text>
				<Text
					style={{
						fontSize: 18,
						color: theme.colors.text,
						marginBottom: 10,
					}}>
					{pin ? "••••" : "No PIN set"}
				</Text>

				<TextInput
					style={styles.input}
					placeholder="Enter new PIN"
					placeholderTextColor={theme.colors.placeholder}
					value={newPin}
					onChangeText={setNewPin}
					secureTextEntry
					keyboardType="numeric"
					maxLength={6}
				/>
				<View style={styles.buttonContainer}>
					<Button
						title="Change PIN"
						onPress={handleChangePin}
						color={theme.colors.primary}
					/>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Appearance</Text>

				<View style={styles.settingItem}>
					<Text style={styles.settingLabel}>Use System Theme</Text>
					<Switch
						value={useSystemTheme}
						onValueChange={(value) => setUseSystemTheme(value)}
						trackColor={{
							false: theme.colors.inputBorder,
							true: theme.colors.primary,
						}}
						thumbColor={
							useSystemTheme
								? theme.colors.buttonText
								: theme.colors.inputBackground
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
								false: theme.colors.inputBorder,
								true: theme.colors.primary,
							}}
							thumbColor={
								isDark
									? theme.colors.buttonText
									: theme.colors.inputBackground
							}
						/>
					</View>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Data Management</Text>

				<View style={styles.buttonContainer}>
					<Button
						title="Clear All Diary Entries"
						color={theme.colors.notification}
						onPress={clearEntries}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						title="Reset App"
						color={theme.colors.notification}
						onPress={resetApp}
					/>
				</View>
			</View>

			<Text style={styles.footer}>More settings will be added soon!</Text>
		</ScrollView>
	);
}
