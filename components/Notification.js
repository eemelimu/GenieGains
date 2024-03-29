import React, { useEffect, useContext, useRef } from "react";
import { useLocalization } from "../contexts/LocalizationContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNotification } from "../contexts/NotificationContext";
import { Fontisto } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";

const NotificationComponent = () => {
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { notification } = useNotification();
  const { isLoading } = notification;

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const { error, success } = notification;

    if (success) {
      Toast.show({
        type: "success",
        text1: t("success"),
        text2: success,
      });
    } else if (error) {
      Toast.show({
        type: "error",
        text1: t("error"),
        text2: error,
      });
    }

    // Start spinning animation when loading starts
    if (isLoading) {
      startSpinAnimation();
    } else {
      // Stop spinning animation when loading ends
      spinValue.setValue(0);
    }
  }, [notification, isLoading]);

  const startSpinAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
      backgroundColor: ThemeColors.primary,
      opacity: 0.7,
    },
    loadingText: {
      color: ThemeColors.tertiary,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 5,
      margin: 5,
    },
    rotatingIcon: {
      transform: [{ rotate: spin }],
    },
  });

  return (
    <>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.rotatingIcon]}>
            <MaterialCommunityIcons
              name="oil-lamp"
              size={24}
              color={ThemeColors.tertiary}
            />
          </Animated.View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </>
  );
};

export default NotificationComponent;
