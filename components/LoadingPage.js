import React from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { ThemeColors } from "../assets/ThemeColors";

const LoadingPage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Logo1.png")}
        style={styles.image}
        resizeMode="contain"
      />
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
  image: {
    marginBottom: 50,
    width: 200,
    height: 200,
  },
});

export default LoadingPage;
