import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useLocalization } from "../contexts/LocalizationContext";
import Button from "../components/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, BackHandler } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { useAuth } from "../contexts/AuthContext";
import { BACKEND_URL } from "../assets/config";
import { useNotification } from "../contexts/NotificationContext";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import useRequest from "../hooks/useRequest";

const Login = () => {
  const { t } = useLocalization();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const { fetcher } = useRequest();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  //remove hardware back button to prevent user from getting back to homscreen after logout
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

  const handleLogin = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "login",
      reqMethod: "POST",
      object: {
        email: username,
        password,
      },
      showLoading: true,
      errorMessage: t("wrong-email-or-password"),
    });
    if (res) {
      dispatch({
        type: "LOGIN",
        payload: { token: res.token },
      });
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: ThemeColors.primary,
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
      <View
        style={[styles.inputRow, emailFocus && { borderBottomColor: "orange" }]}
      >
        <Fontisto
          name="email"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder={t("email")}
          placeholderTextColor={ThemeColors.tertiary}
          autoComplete="username"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
        />
      </View>
      <View
        style={[
          styles.inputRow,
          passwordFocus && { borderBottomColor: "orange" },
        ]}
      >
        <AntDesign
          name="lock"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
          ref={passwordRef}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder={t("password")}
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
          text={t("login")}
          onPress={handleLogin}
        />
        <Button
          isHighlighted={true}
          textSize={20}
          height={50}
          width={"80%"}
          text={t("register")}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

export default Login;
