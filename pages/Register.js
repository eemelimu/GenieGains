import React, { useState, useRef } from "react";
import useRequest from "../hooks/useRequest";
import { useLocalization } from "../contexts/LocalizationContext";
import { LinearGradient } from "expo-linear-gradient";
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
  const { t } = useLocalization();
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
  const [emailFocus, setEmailFocus] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [password2Focus, setPassword2Focus] = useState(false);

  const usernameExists = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "register/username",
      reqMethod: "POST",
      object: { username: username },
      showLoading: true,
    });
    if (!res) {
      console.log(res);
      return true;
    }
    return false;
  };

  const moveToPreferences = async () => {
    if (password !== password2) {
      setError(t("password-match"));
      return;
    }
    if (username === "" || password === "" || email === "") {
      setError(t("fill-all-fields"));
      return;
    }
    if (await usernameExists()) {
      setError(t("username-already-exists"));
      return;
    }
    if (password.length < 5) {
      setError(t("password-length"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("invalid-email"));
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
      position: "relative",
      flexDirection: "row",
      paddingTop: 50,
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.tertiary,
      color: ThemeColors.tertiary,
    },
    gradientOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -2,
      height: 2,
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
          source={require("../assets/GenieGainsTransparent.png")}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.inputRow]}>
        <Fontisto
          name="email"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          ref={emailRef}
          style={styles.input}
          placeholder={t("email")}
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
        />
        {emailFocus && (
          <LinearGradient
            colors={["#0038e3", "#00d0ab"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }} 
            style={styles.gradientOverlay}
          />
        )}
      </View>
      <View
        style={[
          styles.inputRow
        ]}
      >
        <AntDesign
          name="user"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
          style={styles.input}
          placeholder={t("username")}
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
          autoCapitalize="none"
          placeholderTextColor={ThemeColors.tertiary}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        {usernameFocus&&<LinearGradient
          colors={["#0038e3", "#00d0ab"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }} 
          style={styles.gradientOverlay}
        />}
      </View>
      <View
        style={[
          styles.inputRow
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
          style={styles.input}
          placeholder={t("password")}
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
        {passwordFocus&&<LinearGradient
          colors={["#0038e3", "#00d0ab"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }} 
          style={styles.gradientOverlay}
        />}
      </View>
      <View
        style={[
          styles.inputRow
        ]}
      >
        <AntDesign
          name="lock"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.iconStyle}
        />
        <TextInput
          onFocus={() => setPassword2Focus(true)}
          onBlur={() => setPassword2Focus(false)}
          ref={password2Ref}
          style={styles.input}
          placeholder={t("retype-password")}
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
        {password2Focus&&<LinearGradient
          colors={["#0038e3", "#00d0ab"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }} 
          style={styles.gradientOverlay}
        />}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          textSize={20}
          height={50}
          width={"80%"}
          text={t("register")}
          onPress={moveToPreferences}
        />
      </View>
    </View>
  );
};

export default Register;
