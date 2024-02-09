import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
} from "react-native";
import { ThemeColors } from "../assets/ThemeColors";

const HomeScreen = () => {
  const [date] = useState(new Date());

  const dateToString = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleStartWorkout = () => {
    console.log("Start workout button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>{dateToString}</Text>
      <Text style={styles.greetings}>Hello, mf.</Text>
      <Button
        title="Start workout"
        style={styles.button}
        onPress={handleStartWorkout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  date: {
    color: "#02075d",
    fontSize: 15,
    opacity: 0.5,
  },
  greetings: {
    color: ThemeColors.primary,
    fontSize: 30,
  },
  button: {
    backgroundColor: "#FF6347",
    color: ThemeColors.primary,
    padding: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;
