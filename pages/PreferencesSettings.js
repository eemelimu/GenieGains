import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Toast, { ErrorToast } from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
//import { ThemeColors } from "../assets/ThemeColors";
import { ThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { BACKEND_URL } from "../assets/config";
import { useNotification } from "../contexts/NotificationContext";
import { useLocalization } from "../contexts/LocalizationContext";
import useRequest from "../hooks/useRequest";

const Preferences = () => {
  const { t } = useLocalization();
  const { dispatch, state } = useAuth();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const token = state.token;
  const { fetcher } = useRequest(token);
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] =
    useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const { theme: ThemeColors } = useContext(ThemeContext);

  const getUserData = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "GET",
      errorMessage: t("something-went-wrong"),
      showLoading: true,
    });
    if (res) {
      setSelectedUnit(res.unit);
      setSelectedExperience(res.experience);
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
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "PATCH",
      object: { unit: selectedUnit.toLowerCase() },
      errorMessage: t("something-went-wrong"),
    });
    if (res) {
      setIsUnitModalVisible(false);
    }
  };

  const handleConfirmExperience = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "PATCH",
      object: { experience: selectedExperience.toLowerCase() },
      errorMessage: t("something-went-wrong"),
    });
    if (res) {
      setIsExperienceModalVisible(false);
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
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
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
          {t("selected-unit", {
            unit: selectedUnit ? t(selectedUnit) : t("nothing-selected"),
          })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenExperienceModal}
      >
        <Text style={styles.buttonText}>
          {t("selected-experience", {
            level: selectedExperience
              ? t(selectedExperience)
              : t("nothing-selected"),
          })}
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
              <Text style={styles.modalButtonText}>{t("metric")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedUnit === "imperial" && styles.selectedButton,
              ]}
              onPress={() => setSelectedUnit("imperial")}
            >
              <Text style={styles.modalButtonText}>{t("imperial")}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmUnit}
              >
                <Text style={styles.modalButtonText}>{t("confirm")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseUnitModal}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
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
              <Text style={styles.modalButtonText}>{t("beginner")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "intermediate" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("intermediate")}
            >
              <Text style={styles.modalButtonText}>{t("intermediate")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedExperience === "expert" && styles.selectedButton,
              ]}
              onPress={() => setSelectedExperience("expert")}
            >
              <Text style={styles.modalButtonText}>{t("expert")}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmExperience}
              >
                <Text style={styles.modalButtonText}>{t("confirm")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseExperienceModal}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default Preferences;
