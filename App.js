import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./components/HomeScreen";
import { SimpleLineIcons } from "@expo/vector-icons";
import { DrawerContent } from "./components/DrawerContent";
import { Workout } from "./components/Workout";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({ navigation }) => {
  const handleDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleDrawer}>
        <SimpleLineIcons
          name="menu"
          size={30}
          color="black"
          style={{ marginLeft: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
};
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Workout"
        component={Workout}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            options={{ headerShown: false }}
            // options={{
            //   header: ({ navigation }) => (
            //     <CustomHeader navigation={navigation} />
            //   ),
            // }}
            name="Drawer content"
            component={HomeStack}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// export default function App() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Home"
//           screenOptions={{
//             header: ({ navigation }) => (
//               <CustomHeader navigation={navigation} />
//             ),
//           }}
//         >
//           <Stack.Screen name="Home" component={HomeScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }

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
