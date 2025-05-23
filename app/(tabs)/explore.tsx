import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/context/themes";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
export default function ExploreScreen() {
	const { isDark } = useTheme();
	const theme = isDark ? darkTheme : lightTheme;
	const [entries, setEntries] = useState<any[]>([]);



  useFocusEffect(
    useCallback(() => {
      loadEntries(); // Called every time screen is focused
    }, [])
  );


	const loadEntries = async () => {
		const saved = await AsyncStorage.getItem("diaryEntries");
		if (saved) {
			const parsed = JSON.parse(saved);
			// Sorting entries by timestamp in descending order (newest first)
			const sortedEntries = parsed.sort(
				(a: { date: string }, b: { date: string }) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			);
			setEntries(sortedEntries);
		}
	};

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
			]}>
			<Text style={[styles.header, { color: theme.colors.text }]}>
				Explore Diaries
			</Text>

			<FlatList
				data={entries}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View
						style={[
							styles.entry,
							{ backgroundColor: theme.colors.card },
						]}>
						<Text
							style={[
								styles.entryTitle,
								{ color: theme.colors.text },
							]}>
							{item.title}
						</Text>
						<Text
							style={[
								styles.entryTimestamp,
								{ color: theme.colors.border },
							]}>
							{item.date}
						</Text>
						{item.image && (
							<Image
								source={{ uri: item.image }}
								style={styles.entryImage}
								resizeMode="contain"
							/>
						)}
						<Text
							style={[
								styles.entryText,
								{ color: theme.colors.text },
							]}>
							{item.text}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		paddingTop: 50,
		flex: 1,
	},
	header: {
		fontSize: 22,
		textAlign: "center",
		marginBottom: 20,
		fontWeight: "bold",
	},
	entry: {
		marginVertical: 15,
		padding: 20,
		borderRadius: 10,
	},
	entryTitle: {
		fontWeight: "bold",
		fontSize: 20,
		marginBottom: 4,
	},
	entryTimestamp: {
		fontSize: 12,
		marginBottom: 10,
	},
	entryText: {
		fontSize: 16,
		marginTop: 10,
	},
	entryImage: {
		width: "100%",
		height: 300,
		marginTop: 10,
		borderRadius: 10,
	},
});
