import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { storeData, hexToRgba } from "../utils/utils";
import Toast, { ErrorToast } from "react-native-toast-message";
import { useSettings } from "../contexts/SettingsContext";
import { useLocalization } from "../contexts/LocalizationContext";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { BACKEND_URL } from "../assets/config";
import Button from "../components/Button";
import { useNotification } from "../contexts/NotificationContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import useRequest from "../hooks/useRequest";

// TODO
// - FEEDBACK: Animoi inputin avaaminen ja sulkeminen
// - FEEDBACK: Lähetä palautetta toiminnallisuus

const ThemeBtn = ({ colors, name }) => {
  const { theme: ThemeColors, changeThemeColor } = useContext(ThemeContext);

  const handleThemeChange = (colors) => {
    console.log("changing theme");
    storeData("theme", {
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
    });
    changeThemeColor({
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
    });
  };

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      width: 70,
      height: 60,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      padding: 10,
      borderRadius: 10,
      margin: 5,
      width: 50,
      height: 40,
    },
    text: {
      fontSize: 16,
      color: ThemeColors.tertiary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          handleThemeChange(colors);
        }}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        ></LinearGradient>
        <Text style={styles.text}>{name}</Text>
      </Pressable>
    </View>
  );
};

export const DrawerContent = () => {
  const { t } = useLocalization();
  const { disableNotifications, enableTips } = useSettings();
  const { state, dispatch } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);
  console.log("ThemeColors", ThemeColors);
  const [feedbackInputVisible, setFeedbackInputVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackWarning, setFeedbackWarning] = useState(false);
  const navigation = useNavigation();

  const logoutAll = () => {
    const res = fetcher({
      url: BACKEND_URL + "logout",
      reqMethod: "POST",
      errorMessage: t("something-went-wrong"),
    });
    if (res) {
      dispatch({ type: "LOGOUT" });
    }
    setLogoutModalVisible(false);
  };

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    setLogoutModalVisible(false);
  };

  const handleSendFeedback = async () => {
    if (feedbackText.length > 0) {
      fetcher({
        url: BACKEND_URL + "feedback",
        reqMethod: "POST",
        object: {
          text: feedbackText,
        },
      });
      setFeedbackText("");
      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackSent(false);
      }, 3000);
      setFeedbackInputVisible(false);
    } else {
      setFeedbackWarning(true);
      setTimeout(() => {
        setFeedbackWarning(false);
      }, 3000);
    }
  };

  const styles = StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
    sendFeedBackItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    sendFeedBackItemSent: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: ThemeColors.secondary,
      borderRadius: 10,
      alignSelf: "center",
      marginTop: 10,
    },
    sendFeedbackInput: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: ThemeColors.secondary,
      width: 225,
      borderRadius: 5,
      marginHorizontal: 5,
      textAlign: "center",
      fontStyle: "italic",
      color: ThemeColors.tertiary,
      alignSelf: "center",
    },
    drawerItem: {
      fontSize: 25,
      padding: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
      flexDirection: "row",
      alignItems: "center",
    },
    drawerFooterItem: {
      fontSize: 25,
      padding: 15,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    drawerItemIcon: {
      marginRight: 10,
    },
    drawerFooter: {
      position: "absolute",
      bottom: 10,
      width: "100%",
    },
    regularText: {
      fontSize: 16,
      color: ThemeColors.tertiary,
    },
    row: {
      maxWidth: "100%",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "flex-start",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
    },
    modalContainer: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgba(ThemeColors.primary, 0.8),
    },
    modalContent: {
      backgroundColor: hexToRgba(ThemeColors.secondary, 0.9),
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    boldText: {
      fontSize: 20,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
  });

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate("Account Settings");
        }}
      >
        <AntDesign
          name="user"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>{t("account")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Feather
          name="settings"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>{t("settings")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("Troubleshooting")}
      >
        <MaterialIcons
          name="troubleshoot"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>{t("troubleshooting")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("About")}
      >
        <Entypo
          name="help"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>{t("about")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => setFeedbackInputVisible(!feedbackInputVisible)}
      >
        <AntDesign
          name="mail"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>{t("send-feedback")}</Text>
      </TouchableOpacity>
      {feedbackInputVisible && (
        <View style={styles.sendFeedBackItem}>
          <TextInput
            style={[
              styles.sendFeedbackInput,
              feedbackWarning && { borderWidth: 1, borderColor: "red" },
            ]}
            placeholder={t("feedback-placeholder")}
            onChangeText={setFeedbackText}
            placeholderTextColor={ThemeColors.tertiary}
          />
          <TouchableOpacity onPress={handleSendFeedback}>
            <Feather
              name="send"
              size={24}
              color={ThemeColors.tertiary}
              style={{ fontSize: 22, padding: 5 }}
            />
          </TouchableOpacity>
        </View>
      )}
      {feedbackSent && (
        <View style={styles.sendFeedBackItemSent}>
          <Text style={styles.regularText}>{t("feedback-sent")}</Text>
        </View>
      )}
      <View style={styles.row}>
        <ThemeBtn
          colors={["#212121", "#141313", "#b8bfc9", "#797979"]}
          name={t("midnight")}
        />
        <ThemeBtn
          colors={["#4c669f", "#3b5998", "#ffffff", "#192f6a"]}
          name={t("deep-sea")}
        />
        <ThemeBtn
          colors={["#f9d423", "#e65c00", "#333333", "#333333"]}
          name={t("sunset")}
        />
        <ThemeBtn
          colors={["#f8f9fa", "#e9ecef", "#212529", "#495057"]}
          name={t("light")}
        />
        {/* <ThemeBtn
          colors={["#fffacd", "#ffffe0", "#e6d150", "#e6b800"]}
          name="Lemon Sorbet"
        />

        <ThemeBtn
          colors={["#f5f5f5", "#ffe4e1", "#ffc0cb", "#ffb6c1"]}
          name="Rose Quartz"
        />
        <ThemeBtn
          colors={["#fff8dc", "#fffacd", "#d4b996", "#ffb6c1"]}
          name="Buttercream"
        /> */}
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerFooterItem}
          onPress={() => {
            setLogoutModalVisible(true);
          }}
        >
          <SimpleLineIcons
            name="logout"
            size={24}
            color={ThemeColors.tertiary}
            style={styles.drawerItemIcon}
          />
          <Text style={{ fontWeight: "bold", color: ThemeColors.tertiary }}>
            {t("logout")}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.boldText}>{t("logout-confirmation")}</Text>
            <Button
              width={"80%"}
              text={t("yes-from-all-devices")}
              onPress={logoutAll}
              textColor={ThemeColors.tertiary}
            />
            <Button
              width={"80%"}
              text={t("just-this-device")}
              onPress={handleLogout}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={t("cancel")}
              onPress={() => setLogoutModalVisible(false)}
            />
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};
