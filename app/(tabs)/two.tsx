import { StyleSheet, useColorScheme, Image } from "react-native";
import { Calendar } from "react-native-calendars";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import React from "react";

export default function HomeScreen() {
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
  const handleDayPress = (day: { dateString: any }) => {
    console.log("Selected date:", day.dateString);
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
