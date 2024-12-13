import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

export default function TabOneScreen() {
  const [todaysWorkout, setTodaysWorkout] = useState();
  const filePath = FileSystem.documentDirectory + "savedWorkouts.json";
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchWorkouts = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const fileContents = await FileSystem.readAsStringAsync(filePath);
        const savedWorkouts = JSON.parse(fileContents);
        const today = new Date();
        const todayFormatted = formatDate(today);
        const todaysWorkout = savedWorkouts.find((workout: any) => {
          return workout.date === todayFormatted;
        });

        setTodaysWorkout(todaysWorkout.exercises);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todays workout: {todaysWorkout}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
