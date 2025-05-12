import { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pin, setPin] = useState("");
	const [name, setName] = useState("");
	const [mode, setMode] = useState<"set" | "enter" | null>(null);
	const [biometricAvailable, setBiometricAvailable] = useState(false);

	useEffect(() => {
		checkAuthState();
	}, []);

	const checkAuthState = async () => {
		try {
			// Check if PIN exists
			const storedPin = await SecureStore.getItemAsync("user_pin");
			const storedName = await AsyncStorage.getItem("user_name");

			if (!storedPin) {
				setMode("set");
				setLoading(false);
				return;
			}

			// Check biometric availability
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			const isEnrolled = await LocalAuthentication.isEnrolledAsync();
			setBiometricAvailable(hasHardware && isEnrolled);

			if (hasHardware && isEnrolled) {
				const result = await LocalAuthentication.authenticateAsync({
					promptMessage: "Authenticate to continue",
				});

				if (result.success) {
					if (storedName) setName(storedName);
					setAuthenticated(true);
				} else {
					setMode("enter");
				}
			} else {
				setMode("enter");
			}
			setLoading(false);
		} catch (error) {
			console.error("Auth error:", error);
			Alert.alert("Error", "Failed to initialize authentication");
			setLoading(false);
		}
	};

	const handleSetPin = async () => {
		if (name.trim().length < 2) {
			Alert.alert("Please enter a valid name");
			return;
		}
		if (pin.length < 4) {
			Alert.alert("PIN too short", "Please enter at least 4 digits");
			return;
		}

		try {
			await SecureStore.setItemAsync("user_pin", pin);
			await AsyncStorage.setItem("user_name", name.trim());
			setAuthenticated(true);
		} catch (error) {
			console.error("Save error:", error);
			Alert.alert("Error", "Failed to save credentials");
		}
	};

	const handleCheckPin = async () => {
		try {
			const storedPin = await SecureStore.getItemAsync("user_pin");
			if (pin === storedPin) {
				const savedName = await AsyncStorage.getItem("user_name");
				if (savedName) setName(savedName);
				setAuthenticated(true);
			} else {
				Alert.alert("Incorrect PIN");
			}
		} catch (error) {
			console.error("PIN check error:", error);
			Alert.alert("Error", "Failed to verify PIN");
		}
	};

	if (authenticated) return children;

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: theme.colors.background,
				}}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				padding: 24,
				backgroundColor: theme.colors.background,
			}}>
			<Text
				style={{
					fontSize: 22,
					fontWeight: "bold",
					color: theme.colors.text,
					marginBottom: 20,
					textAlign: "center",
				}}>
				{mode === "set" ? "Setup Security" : "Welcome Back"}
			</Text>

			{mode === "set" && (
				<TextInput
					placeholder="Your Name"
					value={name}
					onChangeText={setName}
					placeholderTextColor={theme.colors.placeholder}
					style={{
						borderWidth: 1,
						borderColor: theme.colors.inputBorder,
						backgroundColor: theme.colors.inputBackground,
						color: theme.colors.text,
						borderRadius: 12,
						padding: 14,
						marginBottom: 20,
						fontSize: 16,
					}}
				/>
			)}

			<TextInput
				secureTextEntry
				keyboardType="numeric"
				maxLength={6}
				value={pin}
				onChangeText={setPin}
				placeholder="Enter PIN"
				placeholderTextColor={theme.colors.placeholder}
				style={{
					borderWidth: 1,
					borderColor: theme.colors.inputBorder,
					backgroundColor: theme.colors.inputBackground,
					color: theme.colors.text,
					borderRadius: 12,
					padding: 14,
					marginBottom: 20,
					fontSize: 18,
					textAlign: "center",
				}}
			/>

			<TouchableOpacity
				onPress={mode === "set" ? handleSetPin : handleCheckPin}
				style={{
					backgroundColor: theme.colors.button,
					paddingVertical: 14,
					borderRadius: 12,
					alignItems: "center",
					marginBottom: 16,
				}}>
				<Text
					style={{
						color: theme.colors.buttonText,
						fontWeight: "600",
						fontSize: 16,
					}}>
					{mode === "set" ? "Create Account" : "Unlock"}
				</Text>
			</TouchableOpacity>

			{!biometricAvailable && mode === "enter" && (
				<TouchableOpacity
					onPress={() => LocalAuthentication.authenticateAsync()}
					style={{
						padding: 12,
						alignItems: "center",
					}}>
					<Text style={{ color: theme.colors.primary }}>
						Try Biometric Authentication
					</Text>
				</TouchableOpacity>
			)}

			{/* Development bypass */}
			{__DEV__ && (
				<TouchableOpacity
					style={{ marginTop: 20 }}
					onPress={() => setAuthenticated(true)}>
					<Text
						style={{
							color: theme.colors.text,
							textAlign: "center",
						}}>
						Development Bypass
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}
