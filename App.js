import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginScreen";
import Paskasivu from "./components/Paskasivu";
import SettingsScreen from "./components/SettingsScreen";
import Tos from "./components/Tos";
import ColorSettings from "./components/ColorSettings";
import Preferences from "./components/Preferences";
import NotificationsPreferences from "./components/NotificationsPreferences";
import AccountSettings from "./components/AccoungSettings";
import { ThemeProvider } from "./components/ThemeContext";
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Terms of Service" component={Tos} />
            <Stack.Screen name="Appearance" component={ColorSettings} />
            <Stack.Screen name="Preferences" component={Preferences} />
            <Stack.Screen name="Account Settings" component={AccountSettings} />
            <Stack.Screen
              name="Notification Options"
              component={NotificationsPreferences}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
