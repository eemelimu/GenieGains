import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
//import { ThemeColors } from "../assets/ThemeColors";
import { ThemeContext } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import { BACKEND_URL } from "../assets/config";

const Preferences = () => {
  const { dispatch, state } = useAuth();
  const token = state.token;
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] =
    useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const { theme: ThemeColors } = useContext(ThemeContext);

  const getUserData = async () => {
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
      });
      if (!response.ok) {
        console.log(token);
        throw new Error("HTTP status " + response.status);
      }
      const data = await response.json();
      setSelectedUnit(data.unit);
      setSelectedExperience(data.experience);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [])
  );
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

  const handleConfirmUnit = async () => {
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
        body: JSON.stringify({ unit: selectedUnit.toLowerCase() }),
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      console.log("Selected unit:", selectedUnit);
      setIsUnitModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirmExperience = async () => {
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
        body: JSON.stringify({ experience: selectedExperience.toLowerCase() }),
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      console.log("Selected experience:", selectedExperience);
      setIsExperienceModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
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
                selectedUnit === "metric" && styles.selectedButton,
              ]}
              onPress={() => setSelectedUnit("metric")}
            >
              <Text style={styles.modalButtonText}>Metric</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedUnit === "imperial" && styles.selectedButton,
              ]}
              onPress={() => setSelectedUnit("imperial")}
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
                selectedExperience === "beginner" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("beginner")}
            >
              <Text style={styles.modalButtonText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "intermediate" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("intermediate")}
            >
              <Text style={styles.modalButtonText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "expert" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("expert")}
            >
              <Text style={styles.modalButtonText}>Expert</Text>
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
