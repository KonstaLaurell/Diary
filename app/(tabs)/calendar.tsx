import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Image,
	Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/context/themes";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function CalendarScreen() {
	const { isDark } = useTheme();
	const theme = isDark ? darkTheme : lightTheme;
	const [entries, setEntries] = useState([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [entriesByDate, setEntriesByDate] = useState({});
	const [markedDates, setMarkedDates] = useState({});


  useFocusEffect(
    useCallback(() => {
      loadEntries(); // Called every time screen is focused
    }, [])
  );

	const loadEntries = async () => {
		const saved = await AsyncStorage.getItem("diaryEntries");
		if (saved) {
			const allEntries = JSON.parse(saved);

			const byDate = {};
			const marks = {};
			for (const entry of allEntries) {
				const date = entry.date;

				if (!byDate[date]) byDate[date] = [];
				byDate[date].push(entry);
				marks[date] = {
					marked: true,
					dotColor: theme.colors.primary,
				};
			}

			setEntriesByDate(byDate);
			setMarkedDates(marks);
		}
	};

	const renderEntry = ({ item }) => (
		<View style={[styles.entry, { backgroundColor: theme.colors.card }]}>
			<Text style={[styles.entryTitle, { color: theme.colors.text }]}>
				{item.title}
			</Text>
			<Text
				style={[styles.entryTimestamp, { color: theme.colors.border }]}>
				{item.timestamp}
			</Text>
			{item.image && (
				<Image
					source={{ uri: item.image }}
					style={styles.entryImage}
					resizeMode="contain"
				/>
			)}
			<Text style={[styles.entryText, { color: theme.colors.text }]}>
				{item.text}
			</Text>
		</View>
	);

	const styles = StyleSheet.create({
		container: {
			paddingTop: Platform.OS === "ios" ? 60 : 40,
			paddingHorizontal: 10,
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		noEntry: {
			textAlign: "center",
			marginTop: 20,
			color: theme.colors.border,
		},
		entry: {
			marginVertical: 10,
			padding: 15,
			borderRadius: 10,
		},
		entryTitle: {
			fontWeight: "bold",
			fontSize: 18,
			marginBottom: 4,
		},
		entryTimestamp: {
			fontSize: 12,
			marginBottom: 8,
		},
		entryText: {
			fontSize: 16,
			marginTop: 10,
		},
		entryImage: {
			width: "100%",
			height: 250,
			borderRadius: 8,
			marginTop: 10,
		},
	});

	return (
		<View style={styles.container}>
			<Calendar
				theme={{
					calendarBackground: theme.colors.background,
					dayTextColor: theme.colors.text,
					todayTextColor: theme.colors.primary,
					selectedDayBackgroundColor: theme.colors.primary,
					selectedDayTextColor: "#ffffff",
					monthTextColor: theme.colors.text,
					arrowColor: theme.colors.primary,
					textDisabledColor: theme.colors.border,
					textSectionTitleColor: theme.colors.text,
				}}
				markedDates={{
					...markedDates,
					[selectedDate]: {
						...(markedDates[selectedDate] || {}),
						selected: true,
						selectedColor: theme.colors.primary,
					},
				}}
				onDayPress={(day) => setSelectedDate(day.dateString)}
			/>

			{selectedDate && entriesByDate[selectedDate] ? (
				<FlatList
					data={entriesByDate[selectedDate]}
					keyExtractor={(item) => item.id}
					renderItem={renderEntry}
					style={{ marginTop: 10 }}
				/>
			) : selectedDate ? (
				<Text style={styles.noEntry}>
					No entries for {selectedDate}
				</Text>
			) : (
				<Text style={styles.noEntry}>
					Select a date to view entries
				</Text>
			)}
		</View>
	);
}
