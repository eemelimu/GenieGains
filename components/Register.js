import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";
import { useNotification } from "./NotificationContext";
import { BACKEND_URL } from "../assets/config";

const Register = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  // add unit & experience
  // add password2

  //check if user already exists from /register/username
  const usernameExists = async () => {
    startLoading();
    try {
      const response = await fetch(BACKEND_URL + "register/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      if (!response.ok) {
        return true;
      }
      stopLoading();
      return false;
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error:", error);
    }
  };

  const moveToPreferences = async () => {
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (username === "" || password === "" || email === "") {
      setError("Please fill in all fields");
      return;
    }
    if (await usernameExists()) {
      setError("Username already exists");
      return;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }
    navigation.navigate("Preferences", {
      data: {
        password: password,
        confirmPassword: password2,
        email: email,
        username: username,
      },
    });
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
      <Image style={styles.Logo} source={require("../assets/Logo1.png")} />
      <Text style={styles.information}> Username </Text>
      <TextInput
        style={styles.userNameInput}
        placeholder="    Enter username..."
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.information}> Password </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder="    Enter password..."
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.information}> Confirm Password </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder="    Enter password..."
        secureTextEntry={true}
        value={password2}
        onChangeText={setPassword2}
      />
      <Text style={styles.information}> E-Mail </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder="    Enter E-Mail..."
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.registerBtn} onPress={moveToPreferences}>
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Logo: {
    width: 150,
    height: 150,
  },
  information: {
    paddingTop: 20,
    fontSize: 25,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput: {
    backgroundColor: ThemeColors.white,
    width: "70%",
    height: "7%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },
  registerBtn: {
    paddingTop: 25,
  },
  registerBtnText: {
    backgroundColor: ThemeColors.orange,
    color: ThemeColors.black,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.black,
    fontFamily: "DMBold",
  },
  userNameInput: {
    backgroundColor: ThemeColors.white,
    width: "70%",
    height: "7%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },
});
