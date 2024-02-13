import React from "react";
import { View, Button, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";




const Login = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    "DMBold": require("../assets/fonts/DMSans-Bold.ttf"),
    "DMRegular": require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image 
      style={styles.Logo}
      source={require("../assets/Logo1.png")}></Image>
      <Text style={styles.userName}> Username </Text>
      <TextInput
      style={styles.userNameInput}
      placeholder = "    Enter username..."
      />
      <Text style={styles.password}> Password </Text>
      <TextInput
      style={styles.passwordInput}
      placeholder = "    Enter password..."
      />
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Preferences");
        }}><Text 
        style={styles.registerBtnText}
        >Login</Text></TouchableOpacity>

        <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Register");
        }}>
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create ({
  container: {
    width: "100%",
    color: ThemeColors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  Logo: {
    width: 200,
    height: 200,
    marginTop: 10,
  },

  userName: {
    paddingTop: 40,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },

  password: {
    paddingTop: 40,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput:{
    backgroundColor: ThemeColors.white,
    width: "70%",
    height: "10%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },

  registerBtn: {
    paddingTop: 25,
  
  },
  registerBtnText: {
    backgroundColor: ThemeColors.orange,
    color: ThemeColors.black,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.black,
    fontFamily: "DMBold",
  },

  userNameInput: {
    backgroundColor: ThemeColors.white,
    width: "70%",
    height: "10%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },


  


})
{/* <Button
title="Register"
style={styles.searchBtn}
onPress={() => {
  navigation.navigate("Paskasivu");
}}
/> */}