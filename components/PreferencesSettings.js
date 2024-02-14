import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
//import { ThemeColors } from "../assets/ThemeColors";
import { ThemeContext } from "./ThemeContext";
const Preferences = () => {
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] =
    useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const { theme: ThemeColors } = useContext(ThemeContext);

  const handleOpenUnitModal = () => {
    setIsUnitModalVisible(true);
  };

  const handleCloseUnitModal = () => {
    setIsUnitModalVisible(false);
  };

  const handleOpenExperienceModal = () => {
    setIsExperienceModalVisible(true);
  };

  const handleCloseExperienceModal = () => {
    setIsExperienceModalVisible(false);
  };

  const handleConfirmUnit = () => {
    // Handle confirmation for unit selection
    console.log("Selected unit:", selectedUnit);
    setIsUnitModalVisible(false);
  };

  const handleConfirmExperience = () => {
    // Handle confirmation for experience selection
    console.log("Selected experience:", selectedExperience);
    setIsExperienceModalVisible(false);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    button: {
      backgroundColor: ThemeColors.secondary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 10,
    },
    buttonText: {
      fontSize: 16,
      color: ThemeColors.tertiary,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.secondary,
      opacity: 0.8,
    },
    modalContent: {
      backgroundColor: ThemeColors.secondary,
      borderRadius: 10,
      padding: 20,
      width: "80%",
    },
    modalButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButton: {
      backgroundColor: ThemeColors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginVertical: 5,
      alignItems: "center",
    },
    selectedButton: {
      backgroundColor: ThemeColors.quaternary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    confirmButton: {
      backgroundColor: ThemeColors.quaternary,
      flex: 1,
      marginRight: 5,
    },
    cancelButton: {
      backgroundColor: ThemeColors.primary,
      flex: 1,
      marginLeft: 5,
    },
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleOpenUnitModal}>
        <Text style={styles.buttonText}>
          Select Unit: {selectedUnit || "Not selected"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenExperienceModal}
      >
        <Text style={styles.buttonText}>
          Select Experience: {selectedExperience || "Not selected"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isUnitModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseUnitModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedUnit === "Metric" && styles.selectedButton,
              ]}
              onPress={() => setSelectedUnit("Metric")}
            >
              <Text style={styles.modalButtonText}>Metric</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedUnit === "Imperial" && styles.selectedButton,
              ]}
              onPress={() => setSelectedUnit("Imperial")}
            >
              <Text style={styles.modalButtonText}>Imperial</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmUnit}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseUnitModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isExperienceModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseExperienceModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "Beginner" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("Beginner")}
            >
              <Text style={styles.modalButtonText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "Intermediate" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("Intermediate")}
            >
              <Text style={styles.modalButtonText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "Professional" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("Professional")}
            >
              <Text style={styles.modalButtonText}>Professionaö</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmExperience}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseExperienceModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Preferences;
