import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext";
import { useSettings } from "./SettingsContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TipsPreferences = () => {
  const { settings, enableTips, disableTips } = useSettings();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(settings.tips);
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDisableTips = () => {
    disableTips();
    setTipsEnabled(false);
    setIsModalVisible(false);
  };

  const handleEnableTips = () => {
    enableTips();
    setTipsEnabled(true);
    setIsModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    button: {
      flexDirection: "row",
      backgroundColor: ThemeColors.secondary,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      color: ThemeColors.tertiary,
      marginRight: 10,
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
    modalButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: ThemeColors.quaternary,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
    },
    selectedButton: {
      backgroundColor: ThemeColors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    cancelButton: {
      backgroundColor: ThemeColors.quaternary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleToggleModal}>
        <Text style={styles.buttonText}>
          Tips: {tipsEnabled ? "Enabled" : "Disabled"}
        </Text>
        {tipsEnabled ? (
          <MaterialCommunityIcons
          name="lightbulb-on"
          size={24}
          color={ThemeColors.tertiary}
        />
        ) : (
          <MaterialCommunityIcons
            name="lightbulb-off"
            size={24}
            color={ThemeColors.tertiary}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleToggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[styles.modalButton, tipsEnabled && styles.selectedButton]}
              onPress={() => {
                handleEnableTips();
              }}
            >
              <Text style={styles.modalButtonText}>Enable Tips</Text>
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={24}
                color={ThemeColors.tertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                !tipsEnabled && styles.selectedButton,
              ]}
              onPress={() => {
                handleDisableTips();
              }}
            >
              <Text style={styles.modalButtonText}>Disable Tips</Text>
              <MaterialCommunityIcons
                name="lightbulb-off"
                size={24}
                color={ThemeColors.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleToggleModal}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TipsPreferences;
