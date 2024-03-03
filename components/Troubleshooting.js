import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Troubleshooting = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>1. How to create workout?</Text>
      <Text style={styles.description}>
        To create a workout, you need to go to the homescreen and click on the
        "Start Workout" button. Then you can select either to create a new
        workout or select a workout from the list of workouts.
      </Text>
      <View style={styles.line} />
      <Text style={styles.title}>2. How to delete a workout?</Text>
      <Text style={styles.description}>
        To delete a workout, you need to go to the homescreen and click on
        the workout you want to delete. Then you can delete the workout by clicking
        the three dots on the top right corner and then click on the "Delete" button.
      </Text>
      <View style={styles.line} />

      <Text style={styles.title}>3. How to create new workout templates?</Text>
      <Text style={styles.description}>
        jaksa selittää.
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    marginBottom: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
});
