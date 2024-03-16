import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
//import { ThemeColors } from "../assets/ThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";

const SettingsButton = ({ color, text, children, navigationPage }) => {
  const navigation = useNavigation();
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    boldText: {
      fontWeight: "bold",
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
    button: {
      flex: 1,
      padding: 10,
      backgroundColor: ThemeColors.secondary,
      width: "80%",
      borderRadius: 5,
      borderBottomWidth: 2,
      borderBottomColor: ThemeColors.quaternary,
      alignSelf: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    scrollView: {
      width: "100%",
      marginTop: 20,
      marginVertical: 20,
      marginHorizontal: 20,
    },
  });
  return (
    <Pressable
      onPress={() => navigation.navigate(navigationPage)}
      style={({ pressed }) => [
        styles.button,
        {
          opacity: pressed ? 0.7 : 1,
        },
        styles.row,
      ]}
    >
      <View style={[styles.row]}>
        {children}
        <Text style={styles.boldText}>{text}</Text>
      </View>
      <AntDesign name="arrowright" size={24} color={color} />
    </Pressable>
  );
};

const SettingsScreen = () => {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  const { state } = useAuth();
  const token = state.token;
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const getUsername = async () => {
    try {
      const response = await fetch(BACKEND_URL + "user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUsername();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    boldText: {
      fontWeight: "bold",
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
    button: {
      flex: 1,
      padding: 10,
      backgroundColor: ThemeColors.secondary,
      width: "80%",
      borderRadius: 5,
      borderBottomWidth: 2,
      borderBottomColor: "black",
      alignSelf: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    scrollView: {
      width: "100%",
      marginTop: 20,
      marginVertical: 20,
      marginHorizontal: 20,
    },
  });

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="account-circle"
        size={200}
        color={ThemeColors.secondary}
      />
      <Text style={styles.boldText}>{username}</Text>
      <ScrollView style={styles.scrollView}>
        {/* <SettingsButton
          navigationPage={"Account Settings"}
          color={ThemeColors.tertiary}
          text="Account"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton> */}
        <SettingsButton
          navigationPage={"Appearance"}
          color={ThemeColors.tertiary}
          text="Appearance"
        >
          <FontAwesome
            name="paint-brush"
            size={24}
            color={ThemeColors.tertiary}
            style={{ paddingRight: 15 }}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Notification Settings"}
          color={ThemeColors.tertiary}
          text="Notifications"
        >
          <Ionicons
            name="notifications"
            size={24}
            color={ThemeColors.tertiary}
            style={{ paddingRight: 15 }}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Tip Settings"}
          color={ThemeColors.tertiary}
          text="Tip Settings"
        >
          <MaterialIcons
            name="lightbulb"
            style={{ paddingRight: 15 }}
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Preferences Settings"}
          color={ThemeColors.tertiary}
          text="Preferences"
        >
          <FontAwesome
            name="wrench"
            size={24}
            color={ThemeColors.tertiary}
            style={{ paddingRight: 15 }}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Terms of Service"}
          color={ThemeColors.tertiary}
          text="Terms of Service"
        >
          <FontAwesome
            name="legal"
            size={24}
            color={ThemeColors.tertiary}
            style={{ paddingRight: 15 }}
          />
        </SettingsButton>
        {/* <SettingsButton
          navigationPage={"About"}
          color={ThemeColors.tertiary}
          text="About"
        >
          <AntDesign
            name="exclamationcircle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton> */}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
