import React from "react";
import { View, Button, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from 'expo-checkbox';




const Preferences = () => {
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
      <Text style={styles.preferenceText}> To get started you need to choose your skill level! </Text>
      <View style={styles.checkboxContainer}>

        <CheckBox
        style={styles.checkbox}
        disabled={false}
        />
        <Text style={styles.skills}>     Beginner</Text>

        <CheckBox
        style={styles.checkbox}
        disabled={false}
        />
        <Text style={styles.skills}>     Beginner</Text>

        

        </View>
    </View>
  );
};



const styles = StyleSheet.create ({
  container: {
    width: "100%",
    color: "white",
    
    alignItems: "center",
  },

 checkboxContainer: {
   flexDirection: "row",
   marginBottom: 20,
   alignItems: "vertical",
    
 },

    checkbox: {
      alignSelf: "center",
      
    },

  preferenceText: {
    paddingTop: 10,
    fontSize: 35,
    paddingBottom: 20,
    fontFamily: "DMBold",
    paddingHorizontal: 20,
    textAlign: "center",
  },

  skills: {
    fontSize: 20,
    fontFamily: "DMRegular",
  },

  


});
export default Preferences;

  