import React, { useRef, useState, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { useAuth } from "../contexts/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

const LoadingPageAnim = () => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { dispatch } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const [videoFinished, setVideoFinished] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    dispatch({ type: "START_LOADING" });
    if (videoFinished && animationCompleted) {
      dispatch({ type: "STOPPED_LOADING" });
    }
  }, [videoFinished, animationCompleted, dispatch]);

  const handleVideoEnd = () => {
    setVideoFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0.0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setAnimationCompleted(true);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      zIndex: 999,
    },
    video: {
      backgroundColor: "black",
      width: 400,
      top: 150,
      alignSelf: "center",
      height: "100%",
      position: "absolute",
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Video
          ref={videoRef}
          source={require("../assets/GymJunkieIntro.mp4")}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (!status.isPlaying && status.isLoaded && !videoFinished) {
              handleVideoEnd();
            }
          }}
        />
      </Animated.View>
    </View>
  );
};

export default LoadingPageAnim;
