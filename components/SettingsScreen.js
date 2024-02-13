import React, { useContext } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
//import { ThemeColors } from "../assets/ThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext";

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
      <Text style={styles.boldText}>Username</Text>
      <ScrollView style={styles.scrollView}>
        <SettingsButton
          navigationPage={"Account Settings"}
          color={ThemeColors.tertiary}
          text="Account"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Appearance"}
          color={ThemeColors.tertiary}
          text="Appearance"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Notification Options"}
          color={ThemeColors.tertiary}
          text="Notifications"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Preferences Settings"}
          color={ThemeColors.tertiary}
          text="Preferences"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
        <SettingsButton
          navigationPage={"Terms of Service"}
          color={ThemeColors.tertiary}
          text="Terms of Service"
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={ThemeColors.tertiary}
          />
        </SettingsButton>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
