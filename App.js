import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
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
import Toast, { ErrorToast } from "react-native-toast-message";
import CreateMovement from "./components/CreateMovement";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./components/DrawerContent";
import Routines from "./components/Routines";
import InspectRoutine from "./components/InspectRoutine";
import CreateRoutine from "./components/CreateRoutine";
import { ViewWorkout } from "./components/ViewWorkout";
import { Troubleshooting } from "./components/Troubleshooting";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
    return <View style={styles.header}></View>;
  }
  return (
    <View style={styles.header}>
      {showMenuButton ? (
        <TouchableOpacity onPress={handleDrawer}>
          <SimpleLineIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
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
              console.log(clickCounter);
              console.log("fix toast");
            }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
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
      <Stack.Screen name="Loading" component={LoadingPage} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Workout" component={Workout} />
      <Stack.Screen name="ViewWorkout" component={ViewWorkout} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="Preferences2" component={Preferences2} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Troubleshooting" component={Troubleshooting} />
      <Stack.Screen name="Create Movement" component={CreateMovement} />
      <Stack.Screen
        name="Preferences Settings"
        component={PreferencesSettings}
      />
      <Stack.Screen name="Routines" component={Routines} />
      <Stack.Screen name="InspectRoutine" component={InspectRoutine} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
      <Stack.Screen name="Account Settings" component={AccountSettings} />
      <Stack.Screen name="Terms of Service" component={Tos} />
      <Stack.Screen name="Appearance" component={ColorSettings} />
      <Stack.Screen
        name="Notification Settings"
        component={NotificationsPreferences}
      />
      <Stack.Screen name="Goals" component={GoalsPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <NotificationProvider>
            <AuthProvider>
              <ThemeProvider>
                <Drawer.Navigator
                  drawerContent={(props) => <DrawerContent {...props} />}
                >
                  <Drawer.Screen
                    options={{ headerShown: false }}
                    name=" "
                    component={HomeStack}
                  />
                </Drawer.Navigator>
              </ThemeProvider>
              <Notification />
            </AuthProvider>
          </NotificationProvider>
        </NavigationContainer>
      </SafeAreaView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    height: 110,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
});
