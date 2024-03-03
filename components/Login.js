import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  Image,Modal, Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";
import { useAuth } from "./AuthContext";
import { BACKEND_URL } from "../assets/config";
const Login = () => {
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openModal,setOpenModal]=useState(false);
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    try {
      const res = await fetch(BACKEND_URL+"login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch({
          type: "LOGIN",
          payload: { token: data.token },
        });
      } else {
        setOpenModal(true);
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.Logo}
        source={require("../assets/Logo1.png")}
      ></Image>
      <Text style={styles.userName}> Username </Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.userNameInput}
        placeholder="    Enter username..."
      />
      <Text style={styles.password}> Password </Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={styles.passwordInput}
        placeholder="    Enter password..."
      />
      <TouchableOpacity style={styles.registerBtn} onPress={handleLogin}>
        <Text style={styles.registerBtnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.registerBtnText}>Register</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}><View style={styles.modalContainer}><Text style={styles.errorText}>Wrong username or password</Text><Pressable style={styles.button} onPress={()=>{setOpenModal(false);}}>
          <Text style={styles.ok}>Close</Text></Pressable></View></Modal>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
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
  errorText:{
    fontSize:25,
    color:"red"
  },
  password: {
    paddingTop: 40,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
  },
  passwordInput: {
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
  modalContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    opacity:0.9,
    gap:50,
    backgroundColor:"grey"
  },
  button:{
    backgroundColor:"black",
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:20,
    borderRadius:10,
  },
  ok:{
    color:"white",
    fontSize:20,
  }
});
{
  /* <Button
title="Register"
style={styles.searchBtn}
onPress={() => {
  navigation.navigate("Paskasivu");
}}
/> */
}
