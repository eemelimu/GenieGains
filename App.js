
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login";
import Paskasivu from "./components/Paskasivu";
<<<<<<< HEAD
import Register from "./components/Register";
import Preferences from "./components/Preferences";
import Preferences2 from "./components/Preferences2";
=======
import SettingsScreen from "./components/SettingsScreen";
import Tos from "./components/Tos";
import ColorSettings from "./components/ColorSettings";
import PreferencesSettings from "./components/PreferencesSettings";
import NotificationsPreferences from "./components/NotificationsPreferences";
import AccountSettings from "./components/AccoungSettings";
import { ThemeProvider } from "./components/ThemeContext";
>>>>>>> main

const Stack = createStackNavigator();

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <SimpleLineIcons
        name="menu"
        size={30}
        color="black"
        style={{ marginLeft: 20 }}
        onPress={() => console.log("Drawer menu: toimiva tällainen löytyy omasta branchistä 'HomeScreenDrawer'")}
      />
    </View>
  );
};

export default function App() {
  return (
<<<<<<< HEAD
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen name="Paskasivu" component={Paskasivu} />
        <Stack.Screen name="Preferences2" component={Preferences2} />
      </Stack.Navigator>
    </NavigationContainer>
=======
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
       
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    <>
      <ThemeProvider>
        <NavigationContainer>
           <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: ({ navigation }) => <CustomHeader navigation={navigation} />,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Terms of Service" component={Tos} />
            <Stack.Screen name="Appearance" component={ColorSettings} />
            <Stack.Screen
              name="Preferences Settings"
              component={PreferencesSettings}
            />
            <Stack.Screen name="Account Settings" component={AccountSettings} />
            <Stack.Screen
              name="Notification Options"
              component={NotificationsPreferences}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
>>>>>>> main
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    left: -20,
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
