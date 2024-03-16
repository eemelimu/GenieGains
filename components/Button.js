import React, { useContext } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import tinycolor from "tinycolor2";

const Button = ({
  textSize,
  width,
  height,
  onPress,
  onLongPress,
  isHighlighted,
  renderIcon = () => {
    null;
  },
  text,
}) => {
  const { theme: ThemeColors } = useContext(ThemeContext);

  const buttonBackgroundColor = isHighlighted
    ? ThemeColors.tertiary
    : ThemeColors.secondary;
  const iconColor = isHighlighted
    ? ThemeColors.secondary
    : ThemeColors.tertiary;
  const buttonStyle = [
    {
      alignItems: "center",
      justifyContent: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 8,
      shadowColor: ThemeColors.quaternary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 1,
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    { width, height, backgroundColor: buttonBackgroundColor },
    isHighlighted && {
      backgroundColor: ThemeColors.tertiary,
    },
  ];

  const textStyle = [
    {
      color: ThemeColors.tertiary,
      fontSize: textSize,
    },

    isHighlighted && {
      color: ThemeColors.secondary,
      fontWeight: "bold",
    },
  ];
  const styles = StyleSheet.create({
    pressedButton: {
      opacity: 0.5,
    },
    icon: {
      marginBottom: 5,
    },
  });
  const icon = renderIcon(iconColor);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [buttonStyle, pressed && styles.pressedButton]}
    >
      {renderIcon() != null && <View style={styles.icon}>{icon}</View>}
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  );
};

export default Button;
