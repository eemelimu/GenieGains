import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { epochToDate, lightOrDark } from "../assets/utils/utils";
import { ThemeContext } from "./ThemeContext";
import { useNotification } from "./NotificationContext";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "./AuthContext";
import Button from "./Button";

const muscleCategories = [
  { label: "Triceps", value: "triceps" },
  { label: "Biceps", value: "biceps" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Chest", value: "chest" },
  { label: "Back", value: "back" },
  { label: "Legs", value: "legs" },
  { label: "Core", value: "core" },
  { label: "Other", value: "other" },
];

const CreateMovement = () => {
  const { state: authState } = useAuth();
  const token = authState.token;
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const [movementName, setMovementName] = useState("");
  const [muscleCategory, setMuscleCategory] = useState(
    muscleCategories[muscleCategories.length - 1].value
  );
  const [open, setOpen] = useState(false);

  const handleCreateMovement = async () => {
    if (!movementName) {
      setError("Movement name cannot be empty");
      return;
    }
    startLoading();
    console.log(
      "Creating movement:",
      movementName,
      "Muscle category:",
      muscleCategory
    );
    try {
      const res = await fetch(BACKEND_URL + "movement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
        body: JSON.stringify({
          name: movementName,
          category: muscleCategory,
        }),
      });
      if (res.ok) {
        setSuccess("Movement created");
        console.log("Movement created");
      } else {
        setError("Something went wrong");
        console.log("Error creating movement");
      }
    } catch (error) {
      setError("Check your internet connection");
      console.log("Fetch error: ", error);
    }
    setMovementName("");
    setMuscleCategory(muscleCategories[muscleCategories.length - 1].value);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: ThemeColors.primary,
    },
    label: {
      color: ThemeColors.tertiary,
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: ThemeColors.secondary,
      color: ThemeColors.tertiary,
    },
    dropdownContainer: {
      height: 40,
      borderRadius: 5,
      marginBottom: 20,
    },
    dropdown: {
      backgroundColor: ThemeColors.secondary,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
    },
    dropdownItem: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 5,
      paddingVertical: 7,
      backgroundColor: ThemeColors.secondary,
    },
    createButton: {
      backgroundColor: ThemeColors.quaternary,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: ThemeColors.secondary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={movementName}
        onChangeText={(text) => setMovementName(text)}
        placeholder="Enter movement name"
        placeholderTextColor={ThemeColors.tertiary}
      />
      <Text style={styles.label}>Muscle Category:</Text>
      <DropDownPicker
        containerProps={{
          style: styles.dropdownContainer,
        }}
        itemProps={{
          style: styles.dropdownItem,
        }}
        items={muscleCategories}
        setOpen={setOpen}
        open={open}
        style={styles.dropdown}
        itemStyle={styles.dropdownItem}
        dropDownStyle={styles.dropdown}
        value={muscleCategory}
        setValue={setMuscleCategory}
        theme={lightOrDark(ThemeColors.primary).toUpperCase() || "DEFAULT"}
      />
      {/* <Pressable style={styles.createButton} onPress={handleCreateMovement}>
        <Text style={styles.buttonText}>Create Movement</Text>
      </Pressable> */}
      <Button
        width={"100%"}
        height={50}
        textSize={16}
        isHighlighted={true}
        text="Create Movement"
        onPress={handleCreateMovement}
      />
    </View>
  );
};

export default CreateMovement;
