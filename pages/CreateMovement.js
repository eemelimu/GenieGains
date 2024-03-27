import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { epochToDate, lightOrDark } from "../utils/utils";
import { useLocalization } from "../contexts/LocalizationContext";
import useRequest from "../hooks/useRequest";

import { ThemeContext } from "../contexts/ThemeContext";
import { useNotification } from "../contexts/NotificationContext";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const CreateMovement = () => {
  const { t } = useLocalization();
  const muscleCategories = [
    { label: t("triceps"), value: "triceps" },
    { label: t("biceps"), value: "biceps" },
    { label: t("shoulders"), value: "shoulders" },
    { label: t("chest"), value: "chest" },
    { label: t("back"), value: "back" },
    { label: t("legs"), value: "legs" },
    { label: t("core"), value: "core" },
    { label: t("other"), value: "other" },
  ];
  const { state: authState } = useAuth();
  const token = authState.token;
  const { fetcher } = useRequest(token);
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const [movementName, setMovementName] = useState("");
  const [muscleCategory, setMuscleCategory] = useState(
    muscleCategories[muscleCategories.length - 1].value
  );
  const [open, setOpen] = useState(false);

  const handleCreateMovement = async () => {
    if (!movementName) {
      setError(t("movement-name-empty"));
      return;
    }
    const res = await fetcher({
      url: BACKEND_URL + "movement",
      reqMethod: "POST",
      object: {
        name: movementName,
        category: muscleCategory,
      },
      errorMessage: t("something-went-wrong"),
      successMessage: t("movement-success"),
      showLoading: true,
    });
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
      color: ThemeColors.tertiary,
    },
    dropdownItem: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 5,
      paddingVertical: 7,
      backgroundColor: ThemeColors.secondary,
      color: ThemeColors.tertiary,
    },
    createButton: {
      backgroundColor: ThemeColors.quaternary,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: ThemeColors.tertiary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("movement-name")}</Text>
      <TextInput
        style={styles.input}
        value={movementName}
        onChangeText={(text) => setMovementName(text)}
        placeholder={t("movement-name-placeholder")}
        placeholderTextColor={ThemeColors.tertiary}
      />
      <Text style={styles.label}>{t("muscle-category")}</Text>
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
        text={t("create-movement")}
        onPress={handleCreateMovement}
      />
    </View>
  );
};

export default CreateMovement;
