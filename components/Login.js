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
import { ThemeColors } from "../assets/ThemeColors";
import { useAuth } from "./AuthContext";
const Login = () => {
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch({
          type: "LOGIN",
          payload: { token: "backend sends no token yet lol" },
        });
        navigation.navigate("Home");
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.Logo}
        source={require("../assets/Logo1.png")}
      ></Image>
      <Text style={styles.userName}> Username </Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.userNameInput}
        placeholder="    Enter username..."
      />
      <Text style={styles.password}> Password </Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={styles.passwordInput}
        placeholder="    Enter password..."
      />
      <TouchableOpacity style={styles.registerBtn} onPress={handleLogin}>
        <Text style={styles.registerBtnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    color: ThemeColors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  Logo: {
    width: 200,
    height: 200,
    marginTop: 10,
  },

  userName: {
    paddingTop: 40,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },

  password: {
    paddingTop: 40,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput: {
    backgroundColor: ThemeColors.white,
    width: "70%",
    height: "10%",
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
    height: "10%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },
});
{
  /* <Button
title="Register"
style={styles.searchBtn}
onPress={() => {
  navigation.navigate("Paskasivu");
}}
/> */
}
