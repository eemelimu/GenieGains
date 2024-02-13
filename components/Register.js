import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // add unit & experience
  // add password2

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username: username,
        password: password,
        email: email,
        unit: "metric", // remove hard coding
        experience: "beginner"
      });
      
      console.log(response.status);
      navigation.navigate("Login"); // navigate to login page or homescreen?
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

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
        source={require("../assets/Logo1.png")}
      />
      <Text style={styles.information}> Username </Text>
      <TextInput
        style={styles.userNameInput}
        placeholder = "    Enter username..."
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.information}> Password </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder = "    Enter password..."
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.information}> Confirm Password </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder = "    Enter password..."
        secureTextEntry={true}
      />
      <Text style={styles.information}> E-Mail </Text>
      <TextInput
        style={styles.passwordInput}
        placeholder = "    Enter E-Mail..."
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={registerUser}
      >
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Register;

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Logo: {
    width: 150,
    height: 150,
  },
  information: {
    paddingTop: 20,
    fontSize: 25,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput:{
    backgroundColor: "white",
    width: "70%",
    height: "7%",
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
  userNameInput: {
    backgroundColor: "white",
    width: "70%",
    height: "7%",
    borderRadius: 50,
    fontSize: 20,
    fontFamily: "DMRegular",
  },
});
