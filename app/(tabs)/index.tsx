import { useState, useEffect } from "react";
import {
	Modal,
	Text,
	View,
	Button,
	TextInput,
	StyleSheet,
	Platform,
	FlatList,
	Image,
	ScrollView,
	TouchableOpacity,
	Animated,
	Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
	const { theme } = useTheme();

	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [entries, setEntries] = useState([]);
	const [modalSlide] = useState(new Animated.Value(0));

	useEffect(() => {
		loadAndPickRandomEntries();
	}, []);

	const getTimestamp = () => {
		const now = new Date();
		return now.toLocaleString();
	};

	const handleSave = async () => {
		const newEntry = {
			id: Date.now().toString(),
			title,
			text,
			timestamp: getTimestamp(),
			image,
			date: new Date().toISOString().split("T")[0],
		};

		const saved = await AsyncStorage.getItem("diaryEntries");
		const current = saved ? JSON.parse(saved) : [];
		const updatedEntries = [newEntry, ...current];
		await AsyncStorage.setItem(
			"diaryEntries",
			JSON.stringify(updatedEntries)
		);

		loadAndPickRandomEntries();
		setModalVisible(false);
		setTitle("");
		setText("");
		setImage(null);
	};

	const loadAndPickRandomEntries = async () => {
		const saved = await AsyncStorage.getItem("diaryEntries");
		if (saved) {
			const parsed = JSON.parse(saved);
			const shuffled = parsed.sort(() => 0.5 - Math.random());
			setEntries(shuffled.slice(0, 3));
		}
	};

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			alert("Permission to access media library is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1,
		});

		if (!result.canceled && result.assets.length > 0) {
			setImage(result.assets[0].uri);
		}
	};

	// Slide in animation for modal
	const animateModal = () => {
		Animated.timing(modalSlide, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	// Reset animation when closing
	const resetModal = () => {
		Animated.timing(modalSlide, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	// Get screen height and width
	const screenHeight = Dimensions.get("window").height;
	const screenWidth = Dimensions.get("window").width;

	const styles = StyleSheet.create({
		container: {
			padding: 20,
			paddingTop: 50,
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		header: {
			fontSize: 22,
			textAlign: "center",
			marginBottom: 20,
			fontWeight: "bold",
			color: theme.colors.text,
		},
        modalOverlay: {
            width: "100%",
			flex: 1,
			backgroundColor: theme.colors.overlay,
			justifyContent: "center",
			alignItems: "center",
		},
        modalContent: {
            height:"100%",
            backgroundColor: theme.colors.card,
			padding: 20,
			width: "100%", // Full width
			borderRadius: 10,
			gap: 10,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 10 },
			shadowOpacity: 0.1,
			shadowRadius: 20,
			elevation: 5,
		},
        input: {
			borderColor: theme.colors.inputBorder,
			backgroundColor: theme.colors.inputBackground,
			borderWidth: 1,
			borderRadius: 8,
			paddingHorizontal: 15,
			paddingVertical: Platform.OS === "ios" ? 15 : 10,
			color: theme.colors.text,
			marginBottom: 10,
			fontSize: 16,
		},
		textArea: {
			height: 120,
			textAlignVertical: "top",
		},
		previewImage: {
			width: "100%",
			height: 200,
			marginVertical: 10,
			borderRadius: 10,
		},
		imageButton: {
			backgroundColor: theme.colors.primary,
			padding: 12,
			borderRadius: 6,
			alignItems: "center",
			marginBottom: 10,
		},
		imageButtonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 16,
		},
		entry: {
			marginVertical: 15,
			padding: 20,
			borderRadius: 10,
			backgroundColor: theme.colors.card,
		},
		entryTitle: {
			fontWeight: "bold",
			fontSize: 20,
			marginBottom: 4,
			color: theme.colors.text,
		},
		entryTimestamp: {
			fontSize: 12,
			color: theme.colors.mutedText,
			marginBottom: 10,
		},
		entryText: {
			fontSize: 16,
			marginTop: 10,
			color: theme.colors.text,
		},
		entryImage: {
			width: "100%",
			height: 300,
			marginTop: 10,
			borderRadius: 10,
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.header}>WELCOME TO YOUR DIARY</Text>
			<Button
				title="New Diary"
				onPress={() => {
					setModalVisible(true);
					animateModal();
				}}
				color={theme.colors.primary}
			/>

			<FlatList
				data={entries}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.entry}>
						<Text style={styles.entryTitle}>{item.title}</Text>
						<Text style={styles.entryTimestamp}>
							{item.timestamp}
						</Text>
						{item.image && (
							<Image
								source={{ uri: item.image }}
								style={styles.entryImage}
								resizeMode="contain"
							/>
						)}
						<Text style={styles.entryText}>{item.text}</Text>
					</View>
				)}
			/>

			<Modal
				style={{display:"flex"}}
				transparent
				visible={modalVisible}
				onRequestClose={() => {
					resetModal();
					setModalVisible(false);
				}}>
				<Animated.View
                    style={{
                        height:"100%",
                        display:"flex",
						width: "100%",
						backgroundColor: theme.colors.overlay,
                        justifyContent: "center",
					}}>
					<ScrollView contentContainerStyle={styles.modalContent}>
						<TextInput
							placeholder="Title"
							placeholderTextColor={theme.colors.placeholder}
							value={title}
							onChangeText={setTitle}
							style={styles.input}
						/>
						<TextInput
							placeholder="Text"
							placeholderTextColor={theme.colors.placeholder}
							value={text}
							onChangeText={setText}
							multiline
							numberOfLines={6}
							style={[styles.input, styles.textArea]}
						/>
						{image && (
							<Image
								source={{ uri: image }}
								style={styles.previewImage}
								resizeMode="contain"
							/>
						)}
						<TouchableOpacity
							onPress={pickImage}
							style={styles.imageButton}>
							<Text style={styles.imageButtonText}>
								{image ? "Change Image" : "Add Image"}
							</Text>
						</TouchableOpacity>

						<Button
							title="Save"
							onPress={handleSave}
							color={theme.colors.primary}
						/>
						<Button
							title="Cancel"
							color={theme.colors.mutedText}
							onPress={() => {
								resetModal();
								setModalVisible(false);
							}}
						/>
					</ScrollView>
				</Animated.View>
			</Modal>
		</View>
	);
}
