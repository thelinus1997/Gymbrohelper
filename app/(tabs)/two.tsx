import { StyleSheet, useColorScheme, Image, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import React, { useState } from "react";
import plannedWorkouts from "../../DB/PlannedWorkouts.json";
export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
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
  const markedDates = plannedWorkouts.reduce((acc, workout) => {
    acc[workout.date] = {
      marked: true,
      dotColor: "orange", // Change this to your preferred dot color
      activeOpacity: 0,
    };
    return acc;
  }, {});

  const handleDayPress = (day: { dateString: string }) => {
    // Find the workout for the selected day
    const selectedWorkout = plannedWorkouts.find(
      (workout) => workout.date === day.dateString
    );

    if (selectedWorkout) {
      // If there's a workout, show an alert with the details
      Alert.alert(
        `Workout for ${day.dateString}`,
        `Exercises: ${selectedWorkout.exercises.join(", ")}`,
        [{ text: "OK" }]
      );
    } else {
      // If no workout, show a different alert or do nothing
      Alert.alert(
        "No workout planned",
        "There are no planned workouts for this day.",
        [{ text: "Cancel", style: "cancel" }]
      );
    }
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
          markedDates={markedDates} // Pass the marked dates
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImg: {
    width: "100%",
    height: "30%",
    marginBottom: "25%",
  },
  container: { display: "flex" },
  calendarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    backgroundColor: "transparent",
  },
});
