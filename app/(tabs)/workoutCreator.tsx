import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import exercises from "../../DB/Exercises.json";
import savedWorkouts from "../../DB/SavedWorkouts.json";
import plannedWorkouts from "../../DB/PlannedWorkouts.json";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
const filePath = FileSystem.documentDirectory + "savedWorkouts.json";

export default function WorkoutCreator() {
  const [pickers, setPickers] = useState<
    { id: number; selectedValue: string }[]
  >([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  // Function to add a new picker
  const addPicker = () => {
    setPickers((prev) => [...prev, { id: prev.length + 1, selectedValue: "" }]);
  };

  // Function to update the selected value of a picker
  const updatePickerValue = (id: number, value: string) => {
    setPickers((prev) =>
      prev.map((picker) =>
        picker.id === id ? { ...picker, selectedValue: value } : picker
      )
    );
  };

  // Function to remove a picker
  const removePicker = (id: number) => {
    setPickers((prev) => prev.filter((picker) => picker.id !== id));
  };
  const onSavePress = async () => {
    const selectedExercises = pickers
      .filter((picker) => picker.selectedValue)
      .map((picker) => picker.selectedValue);

    if (selectedExercises.length === 0) {
      Alert.alert("Error", "Please select at least one exercise!");
      return;
    }

    const newWorkout = {
      ID: plannedWorkouts.length + 1, // Generate new ID based on existing workouts
      date: formatDate(date),
      exercises: selectedExercises,
    };

    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      let updatedWorkouts = [];

      if (fileInfo.exists) {
        // Read existing data from the file
        const fileContents = await FileSystem.readAsStringAsync(filePath);
        updatedWorkouts = JSON.parse(fileContents);
      }

      // Add the new workout to the list
      updatedWorkouts.push(newWorkout);

      // Write updated data back to the file
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedWorkouts, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      Alert.alert("Success", "Workout saved successfully!");

      // Clear pickers after saving
      setPickers([]);
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout.");
    }
  };
  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <View style={styles.container}>
      {/* Render list of pickers */}
      <FlatList
        data={pickers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={item.selectedValue}
              style={styles.picker}
              onValueChange={(value) => updatePickerValue(item.id, value)}
            >
              <Picker.Item label="Select an exercise" value="" />
              {exercises.map((exercise) => (
                <Picker.Item
                  key={exercise.ID}
                  label={exercise.name}
                  value={exercise.name}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePicker(item.id)}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Date Picker Section */}
      <SafeAreaView style={styles.dateContainer}>
        <Pressable onPress={showDatepicker} style={styles.datePickerButton}>
          <Text style={styles.text}>{"CHOOSE DATE"}</Text>
        </Pressable>
        <Text style={styles.plannedText}>{formatDate(date)}</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </SafeAreaView>
      {/* Add and Save Buttons */}
      <View style={styles.addButtonContainer}>
        <Pressable style={styles.buttonSave} onPress={onSavePress}>
          <Text style={styles.text}>{"SAVE WORKOUT"}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={addPicker}>
          <Text style={styles.text}>{"ADD EXERCISE"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#FF5C5C",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateContainer: {
    alignItems: "flex-start", // Aligns the date picker button underneath pickers
    marginVertical: 10,
    flexDirection: "row",
    padding: 13,
  },
  plannedText: {
    fontWeight: "bold",
    fontSize: 20,
    width: "46%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    marginLeft: "5%",
    backgroundColor: "black",
    color: "white",
    padding: "2.75%",
    letterSpacing: 2,
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginLeft: "0.5%",
  },
  buttonSave: {
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
    marginRight: "0.5%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
