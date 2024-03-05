import React from "react";
import { View, StyleSheet, Image, ActivityIndicator, Text } from "react-native";
import { ThemeColors } from "../assets/ThemeColors";

const LoadingPage = () => {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
      <ActivityIndicator size="large" color={ThemeColors.secondary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingPage;
