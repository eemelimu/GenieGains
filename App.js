import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import Login from "./components/Login"
import Register from "./components/Register"
import Preferences from "./components/Preferences"
import Preferences2 from "./components/Preferences2"
import PreferencesSettings from "./components/PreferencesSettings"
import { SimpleLineIcons } from '@expo/vector-icons';

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
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            header: ({ navigation }) => <CustomHeader navigation={navigation} />,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Preferences" component={Preferences} />
          <Stack.Screen name="Preferences2" component={Preferences2} />
          <Stack.Screen name="PreferenceSettings" component={PreferencesSettings} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
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
    left: -20,
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
