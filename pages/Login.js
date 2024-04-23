import React, { useState, useCallback, useRef, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedCircles from "../components/AnimatedCircles";
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
import { StyleSheet, BackHandler, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { useAuth } from "../contexts/AuthContext";
import { BACKEND_URL } from "../assets/config";
import { useNotification } from "../contexts/NotificationContext";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import useRequest from "../hooks/useRequest";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

const Login = () => {
  const { width, height } = Dimensions.get("window");
  const usernameTranslateY = useSharedValue(0);
  const passwordTranslateY = useSharedValue(0);
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

  const animatedCirclesBgComponent = useMemo(() => {
    return (
      <AnimatedCircles
        customHeight={Dimensions.get("window").height}
        customWidth={Dimensions.get("window").width}
        startY={70}
        startX={120}
        ballCount={40}
      />
    );
  }, []);
  const animatedCirclesComponent2 = useMemo(() => {
    return (
      <AnimatedCircles
        startY={10}
        startX={64}
        customHeight={60}
        customWidth={80}
        customGradientWidth={100}
        ballCount={5}
        bounce={false}
        minSpeed={0}
      />
    );
  }, []);

  const EmailText = () => {
    return (
      <Animated.Text
        style={[
          styles.usernameText,
          useAnimatedStyle(() => {
            return {
              transform: [{ translateY: usernameTranslateY.value }],
            };
          }),
        ]}
      >
        {t("email")}
      </Animated.Text>
    );
  };

  const PasswordText = () => {
    return (
      <Animated.Text
        style={[
          styles.passwordText,
          useAnimatedStyle(() => {
            return {
              transform: [{ translateY: passwordTranslateY.value }],
            };
          }),
        ]}
      >
        {t("password")}
      </Animated.Text>
    );
  };

  const usernameTextMemo = useMemo(() => {
    return <EmailText />;
  }, []);

  const passwordTextMemo = useMemo(() => {
    return <PasswordText />;
  }, []);

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
      backgroundColor: ThemeColors.primary,
    },
    contentContainer: {
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
    usernameText: {
      position: "absolute",
      top: 45,
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
    passwordText: {
      position: "absolute",
      top: 45,
      color: ThemeColors.tertiary,
      fontSize: 20,
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
      position: "relative",
      flexDirection: "row",
      paddingTop: 50,
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.tertiary,
      maxWidth: "70%",
      minWidth: "70%",
      justifyContent: "center",
    },
    gradientOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -2,
      height: 2,
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
    <>
      <View style={styles.container}>
        {animatedCirclesBgComponent}
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            {animatedCirclesComponent2}
            <Image
              resizeMode={"contain"}
              style={styles.Logo}
              source={require("../assets/GenieGainsTransparent.png")}
            ></Image>
          </View>
          <View
            style={[
              styles.inputRow,
              emailFocus && { borderBottomColor: "orange" },
            ]}
          >
            <Fontisto
              name="email"
              size={24}
              color={ThemeColors.tertiary}
              style={styles.iconStyle}
            />
            {usernameTextMemo}
            <TextInput
              onFocus={() => {
                setEmailFocus(true);
                usernameTranslateY.value = withSpring(-30, {
                  mass: 4.5,
                  damping: 10,
                  stiffness: 100,
                  overshootClamping: false,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 2,
                });
              }}
              onBlur={() => {
                setEmailFocus(false);
                if (username.length === 0) usernameTranslateY.value = 0;
              }}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder={""}
              placeholderTextColor={ThemeColors.tertiary}
              autoComplete="username"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
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
            {passwordTextMemo}
            <TextInput
              onFocus={() => {
                setPasswordFocus(true);
                passwordTranslateY.value = withSpring(-30, {
                  mass: 4.5,
                  damping: 10,
                  stiffness: 100,
                  overshootClamping: false,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 2,
                });
              }}
              onBlur={() => {
                setPasswordFocus(false);
                if (password.length === 0) passwordTranslateY.value = 0;
              }}
              ref={passwordRef}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder={""}
              placeholderTextColor={`${ThemeColors.tertiary}`}
              autoComplete="current-password"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={[
                styles.showPassword,
                password.length === 0 && { opacity: 0 },
              ]}
            >
              {showPassword ? (
                <Feather
                  name="eye-off"
                  size={24}
                  color={ThemeColors.tertiary}
                />
              ) : (
                <Feather name="eye" size={24} color={ThemeColors.tertiary} />
              )}
            </TouchableOpacity>
            {passwordFocus && (
              <LinearGradient
                colors={["#0038e3", "#00d0ab"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientOverlay}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              testID="login"
              textSize={20}
              height={50}
              width={"80%"}
              text={t("login")}
              onPress={handleLogin}
            />
            <Button
              testID="register"
              isHighlighted={true}
              textSize={20}
              height={50}
              width={"80%"}
              text={t("register")}
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default Login;
