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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import exercises from "../../DB/Exercises.json";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function WorkoutCreator() {
  const [pickers, setPickers] = useState<
    { id: number; selectedValue: string }[]
  >([]);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

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
  const onSavePress = () => {
    alert(pickers[0].selectedValue);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.dateContainer}>
        <Pressable onPress={showDatepicker} style={styles.datePickerButton}>
          <Text style={styles.text}>{"Choose date"}</Text>
        </Pressable>
        <Text>selected: {date.toLocaleString()}</Text>
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
      {/* Add Picker Button */}
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
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  dateContainer: {
    flexDirection: "row",
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
    margin: "2%",
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
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
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
