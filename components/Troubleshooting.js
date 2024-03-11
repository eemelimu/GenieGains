import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export const Troubleshooting = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => toggleSection(1)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>1. How to create workout?</Text>
          <MaterialIcons
            name={expandedSections[1] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedSections[1] && (
        <Text style={styles.description}>
          To create a workout, you need to go to the homescreen and click on the
          "Start Workout" button. Then you can select either to create a new
          workout or select a workout from the list of workouts.
        </Text>
      )}
      <View style={styles.line} />

      <TouchableOpacity onPress={() => toggleSection(2)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>2. How to delete a workout?</Text>
          <MaterialIcons
            name={expandedSections[2] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedSections[2] && (
        <Text style={styles.description}>
          To delete a workout, you need to go to the homescreen and click on
          the workout you want to delete. Then you can delete the workout by clicking
          the three dots on the top right corner and then click on the "Delete" button.
        </Text>
      )}
      <View style={styles.line} />

      <TouchableOpacity onPress={() => toggleSection(3)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>3. How to create new workout templates?</Text>
          <MaterialIcons
            name={expandedSections[3] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedSections[3] && (
        <Text style={styles.description}>
          To create a new workout template, you need to go to the homescreen and tap on the "Routines" from the bottom navigation. Then you can create a new workout template by clicking on the "Create Routine" button.
          From there, you can add new movements to the workout template, and then save the workout template by clicking on the "Save" button.
        </Text>
      )}
      <View style={styles.line} />
      
      <TouchableOpacity onPress={() => toggleSection(4)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>4. How to add new movements?</Text>
          <MaterialIcons
            name={expandedSections[4] ? "arrow-drop-down" : "arrow-right"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedSections[4] && (
        <Text style={styles.description}>
          To add new movements, you need to go to the homescreen and tap on the "Routines" from the bottom navigation. Then you can create a new workout template by clicking on the "Create Movement" button.
          From there, you can specify the name and the muscle group of the movement, and then save the movement by clicking on the "Save" button.
        </Text>
      )}
      <View style={styles.line} />
    </ScrollView>
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
