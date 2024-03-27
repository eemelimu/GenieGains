import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { AppState, Settings } from "react-native";
import PushNotificationHandler from "./handlers/PushNotificationHandler";
import TipsPreferences from "./pages/TipsPreferences";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import { useLocalization } from "./contexts/LocalizationContext";
import LanguagePreferences from "./pages/LanguagePreferences";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SettingsProvider } from "./contexts/SettingsContext";
import Tos from "./pages/Tos";
import Notification from "./components/Notification";
import { NotificationProvider } from "./contexts/NotificationContext";
import About from "./pages/About";
import ColorSettings from "./pages/ColorSettings";
import AccountSettings from "./pages/AccountSettings";
import NotificationsPreferences from "./pages/NotificationsPreferences";
import SettingsScreen from "./pages/SettingsScreen";
import PreferencesSettings from "./pages/PreferencesSettings";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SimpleLineIcons } from "@expo/vector-icons";
import HomeScreen from "./pages/HomeScreen";
import LoadingPageAnim from "./pages/LoadingPageAnim";
import GoalsPage from "./pages/GoalsPage";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import UnitRegistration from "./pages/UnitRegistration";
import SkillLevelRegistration from "./pages/SkillLevelRegistration";
import Register from "./pages/Register";
import { Workout } from "./pages/Workout";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import CreateMovement from "./pages/CreateMovement";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./pages/DrawerContent";
import Routines from "./pages/Routines";
import InspectRoutine from "./pages/InspectRoutine";
import CreateRoutine from "./pages/CreateRoutine";
import { ViewWorkout } from "./pages/ViewWorkout";
import { Troubleshooting } from "./pages/Troubleshooting";
import { ThemeColors } from "./assets/theme/ThemeColors";
import FontHandler from "./handlers/FontHandler";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({
  navigation,
  title,
  showMenuButton,
  showNothing,
  route,
}) => {
  const { locale, t } = useLocalization();
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
                text1: t("exit-confirmation"),
                text2: t("exit-text"),
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
        <Text style={styles.headerTitle}>{t(title)}</Text>
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
            title={route.name.toLowerCase().replaceAll(" ", "-")}
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
      <Stack.Screen name="Skill Level" component={SkillLevelRegistration} />
      <Stack.Screen name="Unit Selection" component={UnitRegistration} />
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
      <Stack.Screen name="Language Settings" component={LanguagePreferences} />
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
      {/* <StatusBar
        animated={true}
        backgroundColor={ThemeColors.primary}
        barStyle={"light-content"}
        showHideTransition={"fade"}
        hidden={false}
      /> */}
      <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor={ThemeColors.primary}
          barStyle={"light-content"}
          showHideTransition={"fade"}
          hidden={false}
        />
        <FontHandler>
          <NavigationContainer>
            <NotificationProvider>
              <ThemeProvider>
                <SettingsProvider>
                  <AuthProvider>
                    <LocalizationProvider>
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

                      <Notification />
                    </LocalizationProvider>
                  </AuthProvider>
                </SettingsProvider>
              </ThemeProvider>
            </NotificationProvider>
          </NavigationContainer>
        </FontHandler>
      </SafeAreaView>
      <Toast />
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
