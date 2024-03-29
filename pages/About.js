import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useLocalization } from "../contexts/LocalizationContext";
const About = () => {
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    text: {
      fontSize: 20,
      marginBottom: 20,
      color: ThemeColors.tertiary,
    },
    boldText: {
      fontWeight: "bold",
      fontSize: 22,
      marginBottom: 20,
      color: ThemeColors.tertiary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>GenieGains</Text>
      <Text style={styles.text}>{t("about-description")}</Text>
      <Text style={styles.text}>Version 0.1.0</Text>
    </View>
  );
};
export default About;
