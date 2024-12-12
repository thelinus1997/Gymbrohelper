import {
  StyleSheet,
  useColorScheme,
  Image,
  Alert,
  Pressable,
  TouchableWithoutFeedback,
  Text,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

const filePath = FileSystem.documentDirectory + "savedWorkouts.json"; // Path to the saved workouts file

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [popupContent, setPopupContent] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});
  const colorScheme = useColorScheme();

  const calendarTheme = {
    light: {
      backgroundColor: "white",
      calendarBackground: "white",
      textSectionTitleColor: "#2d4150",
      dayTextColor: "#2d4150",
      todayTextColor: "#00adf5",
      selectedDayBackgroundColor: "#00adf5",
      selectedDayTextColor: "white",
      arrowColor: "#00adf5",
      monthTextColor: "#2d4150",
    },
    dark: {
      backgroundColor: "black",
      calendarBackground: "#1E1E1E",
      textSectionTitleColor: "#B6B6B6",
      dayTextColor: "#DCDCDC",
      todayTextColor: "#FFA726",
      selectedDayBackgroundColor: "#FFA726",
      selectedDayTextColor: "black",
      arrowColor: "#FFA726",
      monthTextColor: "#DCDCDC",
    },
  };
  const formatDate = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchWorkouts = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const fileContents = await FileSystem.readAsStringAsync(filePath);
        const savedWorkouts = JSON.parse(fileContents);

        // Create the markedDates object from saved workouts
        const newMarkedDates = savedWorkouts.reduce(
          (acc: any, workout: any) => {
            const formattedDate = formatDate(workout.date); // Convert date to yyyy-mm-dd
            acc[formattedDate] = {
              marked: true,
              dotColor: "orange",
              activeOpacity: 0,
            };
            return acc;
          },
          {}
        );

        setMarkedDates(newMarkedDates); // Update state with marked dates
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts(); // Call fetchWorkouts when the component mounts
  }, []);

  const handleDayPress = async (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      const fileContents = await FileSystem.readAsStringAsync(filePath);
      const savedWorkouts = JSON.parse(fileContents);

      // Find the workout that matches the selected date
      const matchingWorkouts = savedWorkouts.filter(
        (workout: any) => formatDate(workout.date) === day.dateString
      );

      if (matchingWorkouts.length > 0) {
        const exercises = matchingWorkouts
          .map((workout: any) => workout.exercises.join(", "))
          .join("\n");
        setPopupContent(
          `Workout for ${day.dateString}\nExercises: ${exercises}`
        );
      }
    } else {
      setPopupContent(
        `No workout planned\nThere are no planned workouts for this day.`
      );
    }

    setIsVisible(true);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/bench.png")}
        style={styles.headerImg}
      />
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          theme={
            colorScheme === "dark" ? calendarTheme.dark : calendarTheme.light
          }
          markedDates={markedDates}
        />
      </View>

      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popup}>
                <Text style={styles.popupText}>{popupContent}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImg: {
    width: "100%",
    height: "30%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  addBtnContainer: {},
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    backgroundColor: "transparent",
  },
  buttonSave: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
