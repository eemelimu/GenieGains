import React, { useState, useEffect, useContext } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "./Button";
import tinycolor from "tinycolor2";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { getData, storeData } from "../assets/utils/utils";
import ColorPicker, {
  LuminanceSlider,
  OpacitySlider,
  Panel3,
  Preview,
  Swatches,
  colorKit,
} from "reanimated-color-picker";
import { ThemeContext } from "./ThemeContext";
import { useNotification } from "./NotificationContext";

export default function ColorSettings({}) {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);
  const customSwatches = new Array(6)
    .fill("#fff")
    .map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);

  //const selectedColor = useSharedValue(colors[selectedButton]);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onColorSelect = (color) => {
    "worklet";
    selectedColor.value = color.hex;
  };
  const openColorPicker = (button) => {
    setSelectedButton(button);
    setShowModal(true);
  };
  const [selectedButton, setSelectedButton] = useState("primary");

  const [colors, setColors] = useState(ThemeColors);

  useEffect(() => {
    setColors(ThemeColors);
  }, [ThemeColors]);

  useEffect(() => {
    selectedColor.value = colors[selectedButton];
  }, [selectedButton]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: ThemeColors.primary,
    },
    button: {
      width: "80%",
      marginBottom: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      alignSelf: "center",
    },
    buttonText: {
      color:
        tinycolor(ThemeColors.tertiary).darken(20).toString() === "#000000"
          ? tinycolor(ThemeColors.tertiary).lighten(20).toString()
          : tinycolor(ThemeColors.tertiary).darken(20).toString(),
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
    pickerContainer: {
      alignSelf: "center",
      width: 300,
      backgroundColor: ThemeColors.primary,
      padding: 20,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 10,
    },
    panelStyle: {
      borderRadius: 16,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    sliderStyle: {
      borderRadius: 20,
      marginTop: 20,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    previewContainer: {
      paddingBottom: 20,
      marginBottom: 20,
      borderBottomWidth: 1,
      borderColor: "#bebdbe",
    },
    previewStyle: {
      height: 40,
      borderRadius: 14,
    },
    swatchesContainer: {
      borderTopWidth: 1,
      borderColor: "#bebdbe",
      marginTop: 20,
      paddingTop: 20,
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 10,
    },
    swatchStyle: {
      borderRadius: 20,
      height: 30,
      width: 30,
      margin: 0,
      marginBottom: 0,
      marginHorizontal: 0,
      marginVertical: 0,
    },
    openButton: {
      width: "100%",
      borderRadius: 20,
      paddingHorizontal: 40,
      paddingVertical: 10,
      backgroundColor: "#fff",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      elevation: 5,
      marginTop: 20,
      padding: 10,
    },
    closeButton: {
      bottom: 10,
      borderRadius: 20,
      paddingHorizontal: 40,
      paddingVertical: 10,
      alignSelf: "center",
      backgroundColor: ThemeColors.secondary,
      margin: 10,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => openColorPicker("primary")}
        >
          <Text style={styles.buttonText}>Change Primary Color</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={() => openColorPicker("secondary")}
        >
          <Text style={styles.buttonText}>Change Secondary Color</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.tertiary }]}
          onPress={() => openColorPicker("tertiary")}
        >
          <Text style={styles.buttonText}>Change Tertiary Color</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.quaternary }]}
          onPress={() => openColorPicker("quaternary")}
        >
          <Text style={styles.buttonText}>Change Quaternary Color</Text>
        </Pressable>
        <Button
          isHighlighted={true}
          text="Reset to default"
          width={"80%"}
          onPress={async () => {
            resetTheme();
            //setColors(ThemeColors);
            await storeData("theme", ThemeColors);
            setSuccess("Theme reset to default");
          }}
        />
      </View>

      <Modal
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        animationType="slide"
      >
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={colors[selectedButton]}
              sliderThickness={25}
              thumbShape="circle"
              thumbSize={25}
              onChange={onColorSelect}
              adaptSpectrum
            >
              <View style={styles.previewContainer}>
                <Preview style={styles.previewStyle} />
              </View>

              <Panel3
                style={styles.panelStyle}
                centerChannel="hsl-saturation"
              />

              <LuminanceSlider style={styles.sliderStyle} />

              {/*<OpacitySlider style={styles.sliderStyle} />*/}

              <Swatches
                style={styles.swatchesContainer}
                swatchStyle={styles.swatchStyle}
                colors={customSwatches}
              />
            </ColorPicker>
          </View>
          <View style={styles.row}>
            <Pressable
              style={styles.closeButton}
              onPress={async () => {
                setShowModal(false);
                console.log("You selected:", selectedColor.value);
                //setColors({ ...colors, [selectedButton]: selectedColor.value });
                changeThemeColor({
                  ...ThemeColors,
                  [selectedButton]: selectedColor.value,
                });
                await storeData("theme", {
                  ...ThemeColors,
                  [selectedButton]: selectedColor.value,
                });
                console.log("stored data:", await getData("theme"));
                setSuccess("Theme updated");
                //startLoading();
              }}
            >
              <Text style={{ color: ThemeColors.tertiary, fontWeight: "bold" }}>
                Select
              </Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: ThemeColors.tertiary, fontWeight: "bold" }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
