import React, { useState, useContext, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";
import { useSettings } from "../contexts/SettingsContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalization } from "../contexts/LocalizationContext";
import { supportedLanguages } from "../contexts/LocalizationContext";
import { storeData } from "../utils/utils";
import Button from "../components/Button";

const LanguagePreferences = () => {
  const { t, setLanguage, locale, reset } = useLocalization();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const languages = supportedLanguages;

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setLanguage(language.value);
    setIsModalVisible(false);
    storeData("locale", language.value);
  };
  useEffect(() => {
    setSelectedLanguage(
      supportedLanguages.find((l) => l.value == locale.languageTag) ||
        supportedLanguages.find(
          (l) => l.value == locale.languageTag.split("-")[0] || "en"
        )
    );
  }, [locale]);
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
          {t("language", {
            language: selectedLanguage
              ? selectedLanguage.label
              : t("select-language"),
          })}
        </Text>
        <Entypo name="globe" size={24} color={ThemeColors.tertiary} />
      </TouchableOpacity>
      <Button
        text="Reset to system default"
        isHighlighted={true}
        onPress={reset}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleToggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    selectedLanguage &&
                      selectedLanguage.value === item.value &&
                      styles.selectedButton,
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={styles.modalButtonText}>{item.label}</Text>
                  {selectedLanguage &&
                    selectedLanguage.value === item.value && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color={ThemeColors.tertiary}
                      />
                    )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleToggleModal}
            >
              <Text style={styles.modalButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LanguagePreferences;
