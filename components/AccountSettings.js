import React, { useState, useContext, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Button from "./Button";
import tinycolor from "tinycolor2";
import { useSettings } from "./SettingsContext";
import Toast, { ErrorToast } from "react-native-toast-message";
import { hexToRgba, storeData } from "../assets/utils/utils";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
//import { ThemeColors } from "../assets/ThemeColors";
import { ThemeContext } from "./ThemeContext";
import { BACKEND_URL } from "../assets/config";
import { useFocusEffect } from "@react-navigation/native";
import { useNotification } from "./NotificationContext";

const AccountSettings = () => {
  const { disableNotifications, enableTips } = useSettings();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch, state } = useAuth();
  const token = state.token;
  const [username, setUsername] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const logoutAll = async () => {
    setLogoutModalVisible(false);
    try {
      const response = await fetch(BACKEND_URL + "logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
      });
      if (!response.ok) {
        setError("Something went wrong! Please try again later.");
      } else {
        enableTips();
        disableNotifications();
        dispatch({ type: "LOGOUT" });
        resetTheme();
        storeData("theme", ThemeColors);
        setSuccess("Logged out from all devices successfully");
      }
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error:", error);
    }
  };

  const getUserData = async () => {
    //startLoading();
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
      });
      if (!response.ok) {
        console.log(token);
        throw new Error("HTTP status " + response.status);
      }
      stopLoading();
      //setSuccess("User data fetched successfully");
      const data = await response.json();
      setUsername(data.username);
      setEmail(data.email);
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error:", error);
    }
  };

  const handleEmailChange = async () => {
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        console.log(JSON.stringify({ email: email }));
        console.log(token);
        const data = await response.json();
        console.log(data);
        setError("Invalid email or email already taken");
      } else {
        getUserData();
        setEmailModalVisible(false);
        setSuccess("Email changed successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Check your internet connection");
    }
  };

  const handlePasswordChange = async () => {
    startLoading();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setError("Passwords do not match");
      return;
    }
    setPasswordModalVisible(false);
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
        body: JSON.stringify({ password: password }),
      });
      if (!response.ok) {
        setError("Invalid password");
        throw new Error("HTTP status " + response.status);
      } else {
        setSuccess("Password changed successfully");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Check your internet connection");
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    enableTips();
    setLogoutModalVisible(false);
    disableNotifications();
    dispatch({ type: "LOGOUT" });
    resetTheme();
    storeData("theme", ThemeColors);
  };

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    username: {
      fontSize: 20,
      marginBottom: 20,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      marginLeft: 10,
      color: ThemeColors.tertiary,
    },
    modalContainer: {
      flex: 1,
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgba(ThemeColors.primary, 0.8),
    },
    modalContent: {
      backgroundColor: hexToRgba(ThemeColors.secondary, 0.9),
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: 40,
      borderColor: ThemeColors.quaternary,
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
    },
    saveButton: {
      backgroundColor: ThemeColors.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    saveButtonText: {
      color: ThemeColors.tertiary,
    },
    cancelButton: {
      marginTop: 10,
      padding: 5,
    },
    cancelButtonText: {
      color: ThemeColors.quaternary,
    },
    boldText: {
      fontWeight: "bold",
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>

      <Pressable
        style={styles.button}
        onPress={() => setEmailModalVisible(true)}
      >
        <MaterialIcons name="email" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Change Email</Text>
      </Pressable>
      {/* <Button
      width={"80%"}
        text={"Change Email"}
        onPress={() => setEmailModalVisible(true)}
        renderIcon={(color) => (
          <MaterialIcons name="email" size={24} color={color} />
        )}
      /> */}

      <Pressable
        style={styles.button}
        onPress={() => setPasswordModalVisible(true)}
      >
        <MaterialIcons name="lock" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => setLogoutModalVisible(true)}
      >
        <MaterialIcons name="logout" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => {
          getUserData();
          setEmailModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder={email}
              color={ThemeColors.tertiary}
              placeholderTextColor={ThemeColors.tertiary}
            />
            <Button
              width={"80%"}
              text={"Save"}
              onPress={handleEmailChange}
              color={ThemeColors.primary}
              textColor={ThemeColors.tertiary}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => {
                getUserData();
                setEmailModalVisible(false);
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              color={ThemeColors.tertiary}
              placeholderTextColor={ThemeColors.tertiary}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholderTextColor={ThemeColors.tertiary}
              color={ThemeColors.tertiary}
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {/* <Pressable style={styles.saveButton} onPress={handlePasswordChange}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable> */}
            <Button
              width={"80%"}
              text={"Save"}
              onPress={handlePasswordChange}
              color={ThemeColors.primary}
              textColor={ThemeColors.tertiary}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => {
                setPasswordModalVisible(false);
                setPassword("");
                setConfirmPassword("");
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.boldText}>
              Are you sure you want to logout?
            </Text>
            <Button
              width={"80%"}
              text={"Yes log me out from all devices"}
              onPress={logoutAll}
              textColor={ThemeColors.tertiary}
            />
            <Button
              width={"80%"}
              text={"Logout just from this device"}
              onPress={handleLogout}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => setLogoutModalVisible(false)}
            />
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default AccountSettings;
