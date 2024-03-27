import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
//import { ThemeColors } from "../assets/ThemeColors";
import { ThemeContext } from "../contexts/ThemeContext";
import { useLocalization } from "../contexts/LocalizationContext";

const Tos = () => {
  const { t } = useLocalization();
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      padding: 10,
      color: ThemeColors.tertiary,
      fontSize: 20,
      textAlign: "left",
    },
    boldText: {
      fontWeight: "bold",
      color: ThemeColors.tertiaryy,
      fontSize: 25,
    },
  });
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            {t("terms-of-service-title")}
            {"\n\n"}
          </Text>
          <Text>{t("terms-of-service-text-1")}</Text>
          <Text>{t("terms-of-service-text-2")}</Text>
          <Text>{t("terms-of-service-text-3")}</Text>
          <Text>{t("terms-of-service-text-4")}</Text>
          <Text>{t("terms-of-service-text-5")}</Text>
          <Text>{t("terms-of-service-text-6")}</Text>
          <Text>{t("terms-of-service-text-7")}</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

export default Tos;
