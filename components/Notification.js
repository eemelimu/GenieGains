import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNotification } from "./NotificationContext";

const NotificationComponent = () => {
  const { notification } = useNotification();
  const { isLoading } = notification;
  useEffect(() => {
    const { error, success } = notification;

    if (success) {
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: success,
      });
    } else if (error) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: error,
      });
    }
  }, [notification]);

  const styles = StyleSheet.create({
    loadingContainer: {
      position: "absolute",
      top: Dimensions.get("window").height / 2,
      padding: 40,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      backgroundColor: "white",
      opacity: 0.7,
    },
    loadingText: {
      color: "blue",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 5,
      margin: 5,
    },
  });

  return (
    <>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </>
  );
};

export default NotificationComponent;
