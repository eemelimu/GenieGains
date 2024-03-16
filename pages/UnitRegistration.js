import React, { useState } from "react";
import Button from "../components/Button";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from "expo-checkbox";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const Preferences = ({ route }) => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [SelectedUnit, setSelectedUnit] = useState(null);

  console.log("data from register and preferences?", route.params);

  const registerUser = async () => {
    startLoading();
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
      console.log(
        JSON.stringify({
          username: route.params.data.username,
          password: route.params.data.password,
          email: route.params.data.email,
          unit: SelectedUnit.toLowerCase(),
          experience: route.params.data.selectedSkill.toLowerCase(),
        })
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError("Something went wrong! Please try again later.");
      } else {
        setSuccess("User registered successfully!");
        console.log(data.token);
        dispatch({ type: "LOGIN", payload: { token: data.token } });
      }
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error registering user:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>
        Select which measurement unit you would like to use
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
            color={SelectedUnit === "Metric" ? "orange" : ThemeColors.tertiary}
          />
          <View>
            <Text style={styles.skills}>Metric</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              Eg. Kilograms, Meters, etc.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Imperial")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Imperial"}
            onValueChange={() => setSelectedUnit("Imperial")}
            color={
              SelectedUnit === "Imperial" ? "orange" : ThemeColors.tertiary
            }
          />
          <View>
            <Text style={styles.skills}>Imperial</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              Eg. Pounds, Feet, etc.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.nextButton}>
        <Button
          textSize={20}
          width={120}
          height={50}
          text="Back"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={{ paddingLeft: 10 }}>
          <Button
            textSize={20}
            width={120}
            height={50}
            text="Register"
            onPress={() => {
              registerUser();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "column",
    marginTop: 80,
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
    width: 30,
    height: 30,
    position: "absolute",
    top: 5,
    left: 0,
  },
  preferenceText: {
    paddingTop: 50,
    fontSize: 25,
    marginBottom: 40,
    color: ThemeColors.tertiary,
    textAlign: "center",
  },
  skills: {
    fontSize: 20,
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
