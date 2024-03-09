import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import Button from "./Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, BackHandler } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";
import { useAuth } from "./AuthContext";
import { BACKEND_URL } from "../assets/config";
import { useNotification } from "./NotificationContext";
const Login = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => {
        backHandler.remove();
      };
    }, [])
  );
  if (!fontsLoaded) {
    return <></>;
  }

  const handleLogin = async () => {
    startLoading();
    try {
      const res = await fetch(BACKEND_URL + "login", {
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
        setSuccess("Logged in");
        dispatch({
          type: "LOGIN",
          payload: { token: data.token },
        });
      } else {
        setError("Wrong username or password");
      }
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error:", error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      color: ThemeColors.white,
      justifyContent: "center",
      alignItems: "center",
    },

    Logo: {
      marginTop: 50,
      width: 200,
      height: 50,
      borderColor: ThemeColors.tertiary,
      borderWidth: 1,
      marginBottom: 60,
    },

    userName: {
      paddingTop: 40,
      fontSize: 35,
      paddingBottom: 20,
      fontFamily: "DMBold",
      color: ThemeColors.tertiary,
    },
    errorText: {
      fontSize: 25,
      color: "red",
    },
    password: {
      paddingTop: 40,
      fontSize: 35,
      paddingBottom: 20,
      fontFamily: "DMBold",
      color: ThemeColors.tertiary,
    },
    passwordInput: {
      backgroundColor: ThemeColors.secondary,
      width: "70%",
      height: "10%",
      borderRadius: 50,
      fontSize: 20,
      fontFamily: "DMRegular",
      marginBottom: 50,
    },

    registerBtn: {
      paddingTop: 25,
    },
    registerBtnText: {
      backgroundColor: ThemeColors.tertiary,
      color: ThemeColors.black,
      fontSize: 30,
      padding: 10,
      borderRadius: 25,
      textShadowColor: ThemeColors.tertiary,
      fontFamily: "DMBold",
    },

    userNameInput: {
      backgroundColor: ThemeColors.secondary,
      width: "70%",
      height: "10%",
      borderRadius: 50,
      fontSize: 20,
      fontFamily: "DMRegular",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.9,
      gap: 50,
      backgroundColor: "grey",
    },
    button: {
      backgroundColor: "black",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 10,
    },
    ok: {
      color: "white",
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        resizeMode={"contain"}
        style={styles.Logo}
        source={require("../assets/GJunkie_02.png")}
      ></Image>
      <Text style={styles.userName}> Username </Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.userNameInput}
        placeholder="    Enter username..."
        placeholderTextColor={ThemeColors.tertiary}
        autoComplete="username"
        autoCapitalize="none"
      />
      <Text style={styles.password}> Password </Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={styles.passwordInput}
        placeholder="    Enter password..."
        placeholderTextColor={ThemeColors.tertiary}
        autoComplete="current-password"
        autoCapitalize="none"
      />
      {/* <TouchableOpacity style={styles.registerBtn} onPress={handleLogin}>
        <Text style={styles.registerBtnText}>Login</Text>
      </TouchableOpacity> */}
      <Button
        textSize={20}
        height={50}
        width={"80%"}
        text="Login"
        onPress={handleLogin}
      />

      {/* <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity> */}
      <Button
        isHighlighted={true}
        textSize={20}
        height={50}
        width={"80%"}
        text="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

export default Login;
