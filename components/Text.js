import { StyleSheet } from "react-native";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
const CustomText = ({ textSize, children, usesFont = true, bold = false }) => {
  const isInsideContext = !useContext(ThemeContext);
  const styles = [];
  const baseStyle = StyleSheet.create({
    text: {
      fontSize: textSize,
      fontWeight: bold ? "bold" : "normal",
    },
  });
  styles.push(baseStyle);
  if (isInsideContext) {
    const { theme } = useContext(ThemeContext);
    const dynamicThemeStyles = StyleSheet.create({
      color: theme.tertiary,
    });
    styles.push(dynamicThemeStyles);
  } else {
    const staticThemeStyles = StyleSheet.create({
      color: ThemeColors.tertiary,
    });

    styles.push(staticThemeStyles);
  }

  if (usesFont) {
    const fontStyles = StyleSheet.create({
      fontFamily: bold ? DMBold : DMRegular,
    });
    styles.push(fontStyles);
  } else {
    const fontStyles = StyleSheet.create({
      fontFamily: "System",
    });
    styles.push(fontStyles);
  }

  return <Text style={styles}>{children}</Text>;
};

export default CustomText;
