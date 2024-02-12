import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Paskasivu = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Olet siirtynyt skldaf</Text>
      <Button
        title="Takaisin"
        onPress={() => {
          navigation.navigate("Login");
        }}
      ></Button>
    </View>
  );
};

export default Paskasivu;
