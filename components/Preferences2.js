import React, {useState} from "react";
import { View, Button, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from 'expo-checkbox';
import { ThemeColors } from "../assets/ThemeColors";




const Preferences = () => {
  const navigation = useNavigation();
  const [SelectedUnit, setSelectedUnit] = useState(null);


  let [fontsLoaded] = useFonts({
    "DMBold": require("../assets/fonts/DMSans-Bold.ttf"),
    "DMRegular": require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>
        Lastly you need to select units!
      </Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Metric")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Metric"}
            onValueChange={() => setSelectedUnit("Metric")}
            color="#DB8300"
          />
          <Text style={styles.skills}>Metric </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Imperial")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Imperial"}
            onValueChange={() => setSelectedUnit("Imperial")}
            color="#DB8300"
          />
          <Text style={styles.skills}>Imperial</Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => { navigation.navigate("Paskasivu")}} >

          <Text style={styles.NextBtnText}>Next</Text>
        </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create ({
  container: {
    width: "100%",
    color: ThemeColors.white,
    alignItems: "center",
    justifyContent: "center",
  },

 checkboxContainer: {
  flexDirection: "column",
   marginBottom: 20,
    
 },
 checkboxItem: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 70,
},

  checkbox: {
    alignSelf: "center",
    width: 35,
    height: 35,

  },

  preferenceText: {
    paddingTop: 10,
    fontSize: 35,
    marginBottom: 80,
    fontFamily: "DMBold",
    paddingHorizontal: 20,
    textAlign: "center",
  },

  skills: {
    fontSize: 30,
    fontFamily: "DMRegular",
    paddingLeft: 40,
  },
  NextBtnText: {
    backgroundColor: ThemeColors.orange,
    color: ThemeColors.black,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.black,
    fontFamily: "DMBold",
  }

  


});
export default Preferences;

  