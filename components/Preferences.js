import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from "expo-checkbox";
import { ThemeColors } from "../assets/ThemeColors";

const Preferences = ({ route }) => {
  const navigation = useNavigation();
  const [selectedSkill, setSelectedSkill] = useState(null);
  console.log("data from register?", route.params);

  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const moveToPreferences2 = () => {
    console.log("called movetoPreferences2");
    navigation.navigate("Preferences2", {
      data: {
        ...route.params.data,
        selectedSkill: selectedSkill,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>
        To get started you need to choose your skill level!
      </Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Beginner")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Beginner"}
            onValueChange={() => setSelectedSkill("Beginner")}
            color={ThemeColors.tertiary}
          />
          <Text style={styles.skills}>Beginner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Intermediate")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Intermediate"}
            onValueChange={() => setSelectedSkill("Intermediate")}
            color={ThemeColors.tertiary}
          />
          <Text style={styles.skills}>Intermediate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Professional")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Professional"}
            onValueChange={() => setSelectedSkill("Professional")}
            color={ThemeColors.tertiary}
          />
          <Text style={styles.skills}>Professional</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => {
          moveToPreferences2();
          console.log("tets?");
        }}
      >
        <Text style={styles.NextBtnText}>Next</Text>
      </TouchableOpacity> */}
      <Button
        textSize={22}
        width={120}
        height={50}
        text={"Next"}
        onPress={moveToPreferences2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2F2F2F",
    alignItems: "center",
  },

  checkboxContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 70,
    color: ThemeColors.tertiary,
  },

  checkbox: {
    alignSelf: "center",
    width: 35,
    height: 35,
  },

  preferenceText: {
    paddingTop: 10,
    fontSize: 35,
    marginBottom: 80,
    color: ThemeColors.tertiary,
    fontFamily: "DMBold",
    paddingHorizontal: 20,
    textAlign: "center",
  },

  skills: {
    fontSize: 30,
    fontFamily: "DMRegular",
    paddingLeft: 40,
    color: ThemeColors.tertiary,
  },
  NextBtnText: {
    backgroundColor: ThemeColors.secondary,
    color: ThemeColors.tertiary,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.quaternary,
    fontFamily: "DMBold",
  },
});
export default Preferences;
