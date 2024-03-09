import React, { useRef, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { useAuth } from "./AuthContext";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const LoadingPageAnim = () => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { dispatch } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const [videoFinished, setVideoFinished] = useState(false);

  const handleVideoEnd = async () => {
    await videoRef.current.stopAsync();
    setVideoFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      dispatch({ type: "STOPPED_LOADING" });
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    video: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Video
          ref={videoRef}
          source={require("../assets/gymjunkie.mp4")}
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
