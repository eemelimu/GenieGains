import React, { useState, useRef, useMemo } from "react";
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
  Dimensions,
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
import AnimatedCircles from "../components/AnimatedCircles";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

const Register = () => {
  const emailTranslateY = useSharedValue(0);
  const usernameTranslateY = useSharedValue(0);
  const passwordTranslateY = useSharedValue(0);
  const password2TranslateY = useSharedValue(0);
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

  const animatedCirclesBgComponent = useMemo(() => {
    return (
      <AnimatedCircles
        customHeight={Dimensions.get("window").height}
        customWidth={Dimensions.get("window").width}
        startY={30}
        startX={120}
        ballCount={40}
      />
    );
  }, []);
  const animatedCirclesComponent2 = useMemo(() => {
    return (
      <AnimatedCircles
        startY={5}
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
          styles.emailText,
          useAnimatedStyle(() => {
            return {
              transform: [{ translateY: emailTranslateY.value }],
            };
          }),
        ]}
      >
        {t("email")}
      </Animated.Text>
    );
  };

  const UsernameText = () => {
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
        {t("username")}
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
  const Password2Text = () => {
    return (
      <Animated.Text
        style={[
          styles.password2Text,
          useAnimatedStyle(() => {
            return {
              transform: [{ translateY: password2TranslateY.value }],
            };
          }),
        ]}
      >
        {t("retype-password")}
      </Animated.Text>
    );
  };
  const emailTextMemo = useMemo(() => {
    return <EmailText />;
  }, []);
  const usernameTextMemo = useMemo(() => {
    return <UsernameText />;
  }, []);
  const passwordTextMemo = useMemo(() => {
    return <PasswordText />;
  }, []);
  const password2TextMemo = useMemo(() => {
    return <Password2Text />;
  }, []);

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
      marginTop: 10,
      height: 70,
      width: 320,
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
    emailText: {
      position: "absolute",
      top: 45,
      color: ThemeColors.tertiary,
      fontSize: 20,
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
    password2Text: {
      position: "absolute",
      top: 45,
      color: ThemeColors.tertiary,
      fontSize: 20,
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
      opacity: 1,
      color: ThemeColors.tertiary,
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
      paddingVertical: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      {animatedCirclesBgComponent}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          {animatedCirclesComponent2}
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
          {emailTextMemo}
          <TextInput
            onFocus={() => {
              setEmailFocus(true);
              emailTranslateY.value = withSpring(-30, {
                mass: 4.5,
                damping: 10,
                stiffness: 100,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 2,
              });
            }}
            onBlur={() => {
              if (email.length === 0) emailTranslateY.value = 0;
              setEmailFocus(false);
            }}
            ref={emailRef}
            style={styles.input}
            placeholder={""}
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
        <View style={[styles.inputRow]}>
          <AntDesign
            name="user"
            size={24}
            color={ThemeColors.tertiary}
            style={styles.iconStyle}
          />
          {usernameTextMemo}
          <TextInput
            onFocus={() => {
              setUsernameFocus(true);
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
              setUsernameFocus(false);
              if (username.length === 0) usernameTranslateY.value = 0;
            }}
            style={styles.input}
            placeholder={""}
            value={username}
            onChangeText={setUsername}
            autoComplete="username"
            autoCapitalize="none"
            placeholderTextColor={ThemeColors.tertiary}
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          {usernameFocus && (
            <LinearGradient
              colors={["#0038e3", "#00d0ab"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientOverlay}
            />
          )}
        </View>
        <View style={[styles.inputRow]}>
          <AntDesign
            name="lock"
            size={24}
            color={ThemeColors.tertiary}
            style={styles.iconStyle}
          />
          {passwordTextMemo}
          <TextInput
            onFocus={() => {
              {
                setPasswordFocus(true);
              }
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
            style={styles.input}
            placeholder={""}
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
            style={[
              styles.showPassword,
              password.length === 0 && { opacity: 0 },
            ]}
          >
            {showPassword ? (
              <Feather name="eye-off" size={24} color={ThemeColors.tertiary} />
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
        <View style={[styles.inputRow]}>
          <AntDesign
            name="lock"
            size={24}
            color={ThemeColors.tertiary}
            style={styles.iconStyle}
          />
          {password2TextMemo}
          <TextInput
            onFocus={() => {
              setPassword2Focus(true);
              password2TranslateY.value = withSpring(-30, {
                mass: 4.5,
                damping: 10,
                stiffness: 100,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 2,
              });
            }}
            onBlur={() => {
              setPassword2Focus(false);
              if (password2.length === 0) password2TranslateY.value = 0;
            }}
            ref={password2Ref}
            style={styles.input}
            placeholder={""}
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
          {password2Focus && (
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
            textSize={20}
            height={50}
            width={"80%"}
            text={t("register")}
            onPress={moveToPreferences}
          />
        </View>
      </View>
    </View>
  );
};

export default Register;
