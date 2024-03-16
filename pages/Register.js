import React, { useState, useRef } from "react";
import useRequest from "../hooks/useRequest";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { useNotification } from "../contexts/NotificationContext";
import { BACKEND_URL } from "../assets/config";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Register = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { fetcher } = useRequest();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const emailRef = useRef(null);

  const usernameExists = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "register/username",
      reqMethod: "POST",
      object: { username: username },
      showLoading: true,
    });
    if (!(await res)) {
      console.log(await res);
      return true;
    }
    return false;
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
    navigation.navigate("Skill Level", {
      data: {
        password: password,
        confirmPassword: password2,
        email: email,
        username: username,
      },
    });
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    Logo: {
      borderRadius: 2,
      width: 300,
      height: 70,
      alignSelf: "center",
    },
    logoContainer: {
      marginTop: 10,
      height: 70,
      width: 320,
      justifyContent: "center",
      borderColor: ThemeColors.tertiary,
      marginBottom: 50,
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
      color: ThemeColors.tertiary,
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
    inputRow: {
      position: "aboslute",
      flexDirection: "row",
      paddingTop: 50,
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.tertiary,
      color: ThemeColors.tertiary,
    },
    buttonContainer: {
      paddingVertical: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.Logo}
          source={require("../assets/GymJunkieLogo.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.inputRow}>
        <Fontisto
          name="email"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          ref={emailRef}
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
        />
      </View>
      <View style={styles.inputRow}>
        <AntDesign
          name="user"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
          onSubmitEditing={() => passwordRef.current.focus()}
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
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
          onSubmitEditing={() => password2Ref.current.focus()}
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
      <View style={styles.inputRow}>
        <AntDesign
          name="lock"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          ref={password2Ref}
          style={styles.input}
          placeholder="Retype Password"
          secureTextEntry={!showPassword2}
          value={password2}
          onChangeText={setPassword2}
          autoComplete="password"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
          onSubmitEditing={() => emailRef.current.focus()}
        />
        <TouchableOpacity
          onPress={() => setShowPassword2(!showPassword2)}
          style={[
            styles.showPassword,
            password2.length === 0 && { opacity: 0 },
          ]}
        >
          {showPassword2 ? (
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
          text="Register"
          onPress={moveToPreferences}
        />
      </View>
    </View>
  );
};

export default Register;
