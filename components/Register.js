import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";
import { useNotification } from "./NotificationContext";
import { BACKEND_URL } from "../assets/config";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    Logo: {
      marginTop: 30,
      width: 200,
      height: 50,
      borderColor: ThemeColors.tertiary,
      borderWidth: 1,
      marginBottom: 60,
    },
    information: {
      paddingTop: 20,
      fontSize: 25,
      paddingBottom: 20,
      fontFamily: "DMBold",
      color: ThemeColors.tertiary,
    },
    registerBtn: {
      paddingTop: 25,
    },
    registerBtnText: {
      backgroundColor: ThemeColors.secondary,
      color: ThemeColors.black,
      fontSize: 30,
      padding: 10,
      borderRadius: 25,
      textShadowColor: ThemeColors.black,
      fontFamily: "DMBold",
    },
    input: {
      width: "70%",
      borderRadius: 10,
      fontSize: 20,
      fontFamily: "DMRegular",
      textAlign: "center",
    },
    iconStyle: {
      position: "absolute",
      left: 0,
      top: 45,
    },
    inputRow: {
      position: "aboslute",
      flexDirection: "row",
      paddingTop: 50,
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.tertiary,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        style={styles.Logo}
        source={require("../assets/GJunkie_02.png")}
        resizeMode="contain"
      />
      <View style={styles.inputRow}>
      <AntDesign name="user" size={24} color="black" style={styles.iconStyle} />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputRow}>
      <AntDesign name="lock" size={24} color="black" style={styles.iconStyle} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputRow}>
      <AntDesign name="lock" size={24} color="black" style={styles.iconStyle} />
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          secureTextEntry={true}
          value={password2}
          onChangeText={setPassword2}
          autoComplete="password"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputRow}>
      <Fontisto name="email" size={24} color="black" style={styles.iconStyle} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          autoCapitalize="none"
        />
      </View>
      <Button
        textSize={20}
        height={50}
        width={"80%"}
        text="Register"
        onPress={moveToPreferences}
      />
    </View>
  );
};

export default Register;
