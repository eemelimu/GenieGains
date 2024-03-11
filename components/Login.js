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
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Login = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      flex: 1,
      width: "100%",
      backgroundColor: "#2F2F2F",
      justifyContent: "center",
      alignItems: "center",
    },
    Logo: {
      borderRadius: 2,
      width: 300,
      height: 70,
      alignSelf: "center",
    },
    logoContainer: {
      marginTop: 50,
      height: 70,
      width: 320,
      justifyContent: "center",
      borderColor: ThemeColors.tertiary,
      // borderWidth: 1,
      marginBottom: 150,
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
    input: {
      width: "70%",
      borderRadius: 10,
      fontSize: 20,
      fontFamily: "DMRegular",
      textAlign: "center",
      color: ThemeColors.tertiary,
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
    inputRow: {
      position: "aboslute",
      flexDirection: "row",
      paddingTop: 50,
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.tertiary,
    },
    buttonContainer: {
      marginTop: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    showPassword: {
      position: "absolute",
      right: 0,
      top: 45,
      opacity: 0.5,
    },
    iconStyle: {
      position: "absolute",
      left: 0,
      top: 45,
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          resizeMode={"contain"}
          style={styles.Logo}
          source={require("../assets/GymJunkieLogo.png")}
        ></Image>
      </View>
      <View style={styles.inputRow}>
        <AntDesign
          name="user"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={ThemeColors.tertiary}
          autoComplete="username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputRow}>
        <AntDesign
          name="lock"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={`${ThemeColors.tertiary}`}
          autoComplete="current-password"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={[styles.showPassword, password.length === 0 && { opacity: 0 }]}
        >
          {showPassword ? (
            <Feather name="eye-off" size={24} color={ThemeColors.tertiary} />
          ) : (
            <Feather name="eye" size={24} color={ThemeColors.tertiary} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          textSize={20}
          height={50}
          width={"80%"}
          text="Login"
          onPress={handleLogin}
        />
        <Button
          isHighlighted={true}
          textSize={20}
          height={50}
          width={"80%"}
          text="Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

export default Login;
