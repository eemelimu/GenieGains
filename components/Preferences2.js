import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from "expo-checkbox";
import { ThemeColors } from "../assets/ThemeColors";
import { BACKEND_URL } from "../assets/config";

const Preferences = ({ route }) => {
  const navigation = useNavigation();
  const [SelectedUnit, setSelectedUnit] = useState(null);
  console.log("data from register and preferences?", route.params);
  const registerUser = async () => {
    try {
      const response = await fetch(BACKEND_URL + "register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: route.params.data.username,
          password: route.params.data.password,
          confirmPassword: route.params.data.confirmPassword,
          email: route.params.data.email,
          unit: SelectedUnit.toLowerCase(),
          experience: route.params.data.selectedSkill.toLowerCase(),
        }),
      });
      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      console.log(response.status);
      navigation.navigate("Login"); // navigate to login page or homescreen?
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>
        Lastly you need to select units!
      </Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Metric")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Metric"}
            onValueChange={() => setSelectedUnit("Metric")}
            color="#DB8300"
          />
          <Text style={styles.skills}>Metric </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Imperial")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Imperial"}
            onValueChange={() => setSelectedUnit("Imperial")}
            color="#DB8300"
          />
          <Text style={styles.skills}>Imperial</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => {
          registerUser();
        }}
      >
        <Text style={styles.NextBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    color: ThemeColors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 70,
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
    fontFamily: "DMBold",
    paddingHorizontal: 20,
    textAlign: "center",
  },

  skills: {
    fontSize: 30,
    fontFamily: "DMRegular",
    paddingLeft: 40,
  },
  NextBtnText: {
    backgroundColor: ThemeColors.orange,
    color: ThemeColors.black,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.black,
    fontFamily: "DMBold",
  },
});
export default Preferences;
