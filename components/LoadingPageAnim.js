import React, { useRef, useState, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { useAuth } from "./AuthContext";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

const LoadingPageAnim = () => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { dispatch } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const [videoFinished, setVideoFinished] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    if (videoFinished && animationCompleted) {
      dispatch({ type: "STOPPED_LOADING" });
    }
  }, [videoFinished, animationCompleted, dispatch]);

  const handleVideoEnd = () => {
    setVideoFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0.1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setAnimationCompleted(true);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    video: {
      backgroundColor: "black",
      width: 400,
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
