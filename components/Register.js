import React from "react";
import { View, Button, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";




const Register = () => {
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
      <Text style={styles.password}> E-Mail </Text>
      <TextInput
      style={styles.passwordInput}
      placeholder = "    Enter E-Mail..."
      />
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Preferences");
        }}><Text 
        style={styles.registerBtnText}
        >Register</Text></TouchableOpacity>
        <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Login");
        }}><Text 
        style={styles.registerBtnText}
        >Login</Text></TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create ({
  container: {
    width: "100%",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  Logo: {
    width: 150,
    height: 150,
    
  },

  userName: {
    paddingTop: 25,
    fontSize: 30,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },

  password: {
    paddingTop: 25,
    fontSize: 30,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput:{
    backgroundColor: "white",
    width: "70%",
    height: "8%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },

  registerBtn: {
    paddingTop: 25,
  },
  registerBtnText: {
    backgroundColor: "#DB8300",
    color: "black",
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: "black",
    fontFamily: "DMBold",
  },

  loginBtn: {
    paddingTop: 10,
  },
  loginBtnText: {
    backgroundColor: "#DB8300",
    color: "black",
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: "black",
    fontFamily: "DMBold",
  },

  userNameInput: {
    backgroundColor: "white",
    width: "70%",
    height: "8%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },


  


})