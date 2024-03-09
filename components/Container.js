import React, { useContext } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import tinycolor from "tinycolor2";
import { ThemeContext } from "./ThemeContext";

const Container = ({ children }) => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const gradientStartColor = tinycolor(ThemeColors.primary)
    .darken(5)
    .toString();
  const gradientEndColor = tinycolor(ThemeColors.primary).lighten(5).toString();

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[gradientStartColor, ThemeColors.primary, gradientEndColor]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
};

export default Container;
