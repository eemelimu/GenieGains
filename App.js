import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
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

const Stack = createStackNavigator();

const CustomHeader = ({ navigation, title, showMenuButton }) => {
  return (
    <View style={styles.header}>
      {showMenuButton ? (
        <TouchableOpacity onPress={() => console.log("Drawer menu")}>
          <SimpleLineIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {" "}
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator
            initialRouteName={"Login"}
            screenOptions={({ navigation, route }) => ({
              header: () => (
                <CustomHeader
                  navigation={navigation}
                  title={route.name}
                  showMenuButton={route.name === "Home"}
                />
              ),
            })}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Goals" component={GoalsPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Preferences" component={Preferences} />
            <Stack.Screen name="Preferences2" component={Preferences2} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaView>
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
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
});
