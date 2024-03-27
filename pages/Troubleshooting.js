import React, { useState, useContext } from "react";
import { useLocalization } from "../contexts/LocalizationContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";

export const Troubleshooting = () => {
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const styles = StyleSheet.create({
    line: {
      position: "relative",
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
      width: "100%",
      marginBottom: 20,
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: ThemeColors.primary,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      paddingHorizontal: 20,
      paddingBottom: 20,
      color: ThemeColors.tertiary,
    },
    description: {
      color: ThemeColors.tertiary,
      fontSize: 18,
      marginBottom: 30,
      paddingHorizontal: 20,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => toggleSection(1)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("how-to-create-workout")}</Text>
          <MaterialIcons
            name={expandedSections[1] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color={ThemeColors.tertiary}
          />
        </View>
      </TouchableOpacity>
      {expandedSections[1] && (
        <Text style={styles.description}>{t("workout-creation-hint")}</Text>
      )}
      <View style={styles.line} />

      <TouchableOpacity onPress={() => toggleSection(2)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("how-to-delete-workout")}</Text>
          <MaterialIcons
            name={expandedSections[2] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color={ThemeColors.tertiary}
          />
        </View>
      </TouchableOpacity>
      {expandedSections[2] && (
        <Text style={styles.description}>{t("delete-workout-hint")}</Text>
      )}
      <View style={styles.line} />

      <TouchableOpacity onPress={() => toggleSection(3)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {t("how-to-create-workout-template")}
          </Text>
          <MaterialIcons
            name={expandedSections[3] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color={ThemeColors.tertiary}
          />
        </View>
      </TouchableOpacity>
      {expandedSections[3] && (
        <Text style={styles.description}>
          {t("how-to-create-routine-hint")}
        </Text>
      )}
      <View style={styles.line} />

      <TouchableOpacity onPress={() => toggleSection(4)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("how-to-add-movement")}</Text>
          <MaterialIcons
            name={expandedSections[4] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color={ThemeColors.tertiary}
          />
        </View>
      </TouchableOpacity>
      {expandedSections[4] && (
        <Text style={styles.description}>{t("how-to-add-movement-hint")}</Text>
      )}
      <View style={styles.line} />
    </ScrollView>
  );
};
