import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { AppState, Settings } from "react-native";
import PushNotificationHandler from "./components/PushNotificationHandler";
import TipsPreferences from "./components/TipsPreferences";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SettingsProvider } from "./components/SettingsContext";
import Tos from "./components/Tos";
import Notification from "./components/Notification";
import { NotificationProvider } from "./components/NotificationContext";
import About from "./components/About";
import ColorSettings from "./components/ColorSettings";
import AccountSettings from "./components/AccountSettings";
import NotificationsPreferences from "./components/NotificationsPreferences";
import SettingsScreen from "./components/SettingsScreen";
import PreferencesSettings from "./components/PreferencesSettings";
import { ThemeProvider } from "./components/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SimpleLineIcons } from "@expo/vector-icons";
import HomeScreen from "./components/HomeScreen";
//import HomeScreen from "./components/LoadingPageAnim"
import LoadingPageAnim from "./components/LoadingPageAnim";
import GoalsPage from "./components/GoalsPage2";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
import Preferences from "./components/Preferences";
import Preferences2 from "./components/Preferences2";
import Register from "./components/Register";
import { useAuth } from "./components/AuthContext";
import LoadingPage from "./components/LoadingPage";
import { Workout } from "./components/Workout";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import CreateMovement from "./components/CreateMovement";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./components/DrawerContent";
import Routines from "./components/Routines";
import InspectRoutine from "./components/InspectRoutine";
import CreateRoutine from "./components/CreateRoutine";
import { ViewWorkout } from "./components/ViewWorkout";
import { Troubleshooting } from "./components/Troubleshooting";
import { ThemeColors } from "./assets/ThemeColors";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "lightgreen",
        backgroundColor: "white",
        top: 35,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      }}
      text2Style={{
        color: "white",
        fontSize: 13,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "lightcoral",
        backgroundColor: "white",
        top: 35,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
      }}
      text2Style={{
        color: "white",
        fontSize: 13,
      }}
    />
  ),
};

const CustomHeader = ({
  navigation,
  title,
  showMenuButton,
  showNothing,
  route,
}) => {
  const [clickCounter, setClickCounter] = useState(0);
  const handleDrawer = () => {
    navigation.openDrawer();
  };
  if (showNothing) {
    return null; //<View style={styles.header}></View>;
  }
  return (
    <View style={styles.header}>
      {showMenuButton ? (
        <TouchableOpacity style={styles.icon} onPress={handleDrawer}>
          <SimpleLineIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            if (route !== "Workout" || clickCounter === 1) {
              setClickCounter(0);
              navigation.goBack();
            } else {
              setClickCounter(clickCounter + 1);
              Toast.show({
                type: "error",
                text1: "Are you sure you want to exit?",
                text2:
                  "There may be unsaved changes. Press back again to confirm exit.",
              });
            }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      )}
      {route === "Home" ? (
        <Image
          style={styles.logo}
          resizeMode={"contain"}
          source={require("./assets/GymJunkieLogo.png")}
        ></Image>
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Loading"}
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            title={route.name}
            showMenuButton={route.name === "Home"}
            route={route.name}
            showNothing={route.name === "Loading" || route.name === "Login"}
          />
        ),
      })}
    >
      <Stack.Screen name="Loading" component={LoadingPageAnim} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Workout" component={Workout} />
      <Stack.Screen name="ViewWorkout" component={ViewWorkout} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Skill Level" component={Preferences} />
      <Stack.Screen name="Unit Selection" component={Preferences2} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Troubleshooting" component={Troubleshooting} />
      <Stack.Screen name="Create Movement" component={CreateMovement} />
      <Stack.Screen
        name="Preferences Settings"
        component={PreferencesSettings}
      />
      <Stack.Screen name="Routines" component={Routines} />
      <Stack.Screen name="Inspect Routine" component={InspectRoutine} />
      <Stack.Screen name="Create Routine" component={CreateRoutine} />
      <Stack.Screen name="Account Settings" component={AccountSettings} />
      <Stack.Screen name="Terms of Service" component={Tos} />
      <Stack.Screen name="Appearance" component={ColorSettings} />
      <Stack.Screen
        name="Notification Settings"
        component={NotificationsPreferences}
      />
      <Stack.Screen name="Tip Settings" component={TipsPreferences} />
      <Stack.Screen name="Goals" component={GoalsPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={ThemeColors.primary}
        barStyle={"light-content"}
        showHideTransition={"fade"}
        hidden={false}
      />
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <NotificationProvider>
            <ThemeProvider>
              <AuthProvider>
                <SettingsProvider>
                  <PushNotificationHandler />
                  <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                  >
                    <Drawer.Screen
                      options={{ headerShown: false }}
                      name=" "
                      component={HomeStack}
                    />
                  </Drawer.Navigator>
                </SettingsProvider>
                <Notification />
              </AuthProvider>
            </ThemeProvider>
          </NotificationProvider>
        </NavigationContainer>
      </SafeAreaView>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingTop: 0,
    height: 70,
    backgroundColor: ThemeColors.primary,
  },
  headerTitle: {
    position: "relative",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "auto",
    marginTop: "auto",
    color: "white",
  },
  icon: {
    top: 0,
    position: "absolute",
    left: 0,
    padding: 10,
    marginTop: 12,
  },
  logo: {
    position: "relative",
    top: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 150,
    height: 40,
  },
});
