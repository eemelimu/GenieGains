import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
  withRepeat,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

let { width, height } = Dimensions.get("window");

const AnimatedCircles = ({
  startX,
  startY,
  ballCount,
  customWidth,
  customHeight,
  customGradientWidth,
  bounce = true,
  minSpeed = 0.4,
}) => {
  const isFocused = useIsFocused();
  const [initialStartX, setInitialStartX] = useState(startX);
  const [initialStartY, setInitialStartY] = useState(startY);
  const randomValues = useRef(
    Array.from({ length: ballCount }, () => Math.random())
  );
  const directions = useRef(
    Array.from({ length: ballCount }, () => ({
      x: Math.random() < 0.5 ? 1 : -1,
      y: Math.random() < 0.5 ? 1 : -1,
    }))
  );

  useEffect(() => {
    setInitialStartX(startX);
    setInitialStartY(startY);
    randomValues.current = Array.from({ length: ballCount }, () =>
      Math.random()
    );
    directions.current = Array.from({ length: ballCount }, () => ({
      x: Math.random() < 0.5 ? Math.random() : -Math.random(),
      y: Math.random() < 0.5 ? Math.random() : -Math.random(),
    }));
  }, [startX, startY, ballCount]);

  const circles = randomValues.current.map((random, index) => {
    const radius = 5 * random;
    const opacity = random;

    if (customWidth && customHeight) {
      width = customWidth;
      height = customHeight;
    }
    const hr = height - radius;
    const wr = width - radius;
    const x = useSharedValue(
      initialStartX ? initialStartX + random * 10 : random * wr
    );
    const y = useSharedValue(
      initialStartY ? initialStartY + random * 10 : random * hr
    );

    const speedX = random + minSpeed;
    const speedY = random + minSpeed;

    useEffect(() => {
      const randomVal = Math.random();
      x.value = initialStartX ? initialStartX + randomVal * 10 : randomVal * wr;
      y.value = initialStartY ? initialStartY + randomVal * 10 : randomVal * hr;
    }, [isFocused]);

    const circleStyle = useAnimatedStyle(() => {
      x.value += speedX * directions.current[index].x;
      y.value += speedY * directions.current[index].y;

      if (bounce) {
        if (x.value < 0 || x.value > wr) {
          directions.current[index].x *= -1;
        }
        if (y.value < 0 || y.value > hr) {
          directions.current[index].y *= -1;
        }
      } else {
        const newRandom = Math.random();
        if (x.value < 0 || x.value > wr) {
          x.value = newRandom * wr;
          y.value = newRandom * hr;
        }
        if (y.value < 0 || y.value > hr) {
          y.value = newRandom * hr;
          x.value = newRandom * wr;
        }
      }

      const color = interpolateColor(
        customGradientWidth
          ? (x.value + radius) / customGradientWidth
          : (x.value + radius) / width,
        [0, 1],
        ["#0038e3", "#00d0ab"]
      );

      return {
        transform: [{ translateX: x.value }, { translateY: y.value }],
        backgroundColor: color,
      };
    });

    return (
      <Animated.View
        key={index}
        style={[
          circleStyle,

          {
            position: "absolute",
            width: 0.2 + radius,
            height: 0.2 + radius,
            borderRadius: 999,
            opacity: opacity,
          },
        ]}
      />
    );
  });

  return <>{circles}</>;
};

export default AnimatedCircles;
