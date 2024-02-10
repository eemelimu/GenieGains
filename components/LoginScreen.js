import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button
        title="Nappi"
        onPress={() => {
          navigation.navigate("Settings");
        }}
      />
    </View>
  );
};

export default LoginScreen;
