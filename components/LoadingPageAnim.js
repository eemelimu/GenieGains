import React, { useState, useEffect } from "react";
import { View, Image, Animated, Easing, Dimensions } from "react-native";

// Preloading images using require syntax
const GJunkie_0 = require("../assets/GJunkie_0.png");
const GJunkie_1 = require("../assets/GJunkie_1.png");
const GJunkie_2 = require("../assets/GJunkie_2.png");
const GJunkie_3 = require("../assets/GJunkie_3.png");
const GJunkie_4 = require("../assets/GJunkie_4.png");
const GJunkie_5 = require("../assets/GJunkie_5.png");

const AnimationScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));
  const [imageIndex, setImageIndex] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const interval = setInterval(() => {
      if (imageIndex < 5) {
        setImageIndex((prevIndex) => prevIndex + 1);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [imageIndex]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100, // Adjust duration as needed
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [imageIndex]);

  useEffect(() => {
    if (imageIndex === 5) {
      Animated.timing(scaleAnim, {
        toValue: 300,
        duration: 4500, // Adjust duration as needed
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [imageIndex]);

  return (
    <>
      <Image source={GJunkie_0} style={{ width: 0, height: 0 }} />
      <Image source={GJunkie_1} style={{ width: 0, height: 0 }} />
      <Image source={GJunkie_2} style={{ width: 0, height: 0 }} />
      <Image source={GJunkie_3} style={{ width: 0, height: 0 }} />
      <Image source={GJunkie_4} style={{ width: 0, height: 0 }} />
      <Image source={GJunkie_5} style={{ width: 0, height: 0 }} />
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              imageIndex === 0
                ? GJunkie_0
                : imageIndex === 1
                ? GJunkie_1
                : imageIndex === 2
                ? GJunkie_2
                : imageIndex === 3
                ? GJunkie_3
                : imageIndex === 4
                ? GJunkie_4
                : GJunkie_5
            }
            style={{ width: 300, height: 300, resizeMode: "contain" }}
          />
        </Animated.View>
        {imageIndex === 5 && (
          <Animated.View
            style={{
              position: "absolute",
              top: screenHeight / 2,
              right: 10,
              backgroundColor: "green",
              width: 5,
              height: 5,
              borderRadius: 5, // Ensure it's a circle
              transform: [{ scale: scaleAnim }],
            }}
          />
        )}
      </View>
    </>
  );
};

export default AnimationScreen;
