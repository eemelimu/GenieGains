import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { AppState, Settings } from "react-native";
import { useSettings } from "./SettingsContext";

const sendNotification = async (title, text, seconds) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: text,
    },
    trigger: {
      seconds: seconds,
    },
  });
};

const NotificationHandler = () => {
  const [notifPermission, setNotifPermission] = useState(false);
  const { settings } = useSettings();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All upcoming notifications have been canceled.");
  };
  const getPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      setNotifPermission(false);
      return;
    }
    setNotifPermission(true);
  };
  const newNotification = async () => {
    if (notifPermission) {
      await sendNotification("BRO SLACKING??", "Cant believe this!", 5);
      await sendNotification(
        "SLACKER TRACKER",
        "OUR SLACKER TRACKER SYSTEM CAUGHT HOMIE SLACKING",
        10
      );
      await sendNotification(
        "What bro you doing?",
        "You really doing this for me, huh?",
        15
      );
      await sendNotification("??", "??????", 20);
      await sendNotification("??????", "????????????????????", 25);
      await sendNotification("GET", "GET", 30);
      await sendNotification("BACK", "BACK", 35);
      await sendNotification("TO", "TO", 40);
      await sendNotification("GRIND", "GRIND", 45);
      await sendNotification(
        "SLACKER",
        "Come back and get your workout in!",
        50
      );
      await sendNotification(
        "!!!!!!",
        "Come back and get your workout in!",
        55
      );
      await sendNotification("IM NOT GOING TO STOP", ":)", 60);
    }
  };

  useEffect(() => {
    getPermission();
    const handleAppStateChange = (nextAppState) => {
      console.log(nextAppState);
      console.log(settings.notifications);
      if (nextAppState === "background") {
        if (settings.notifications) {
          newNotification();
        } else {
          cancelAllNotifications();
        }
      } else {
        cancelAllNotifications();
      }
    };
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, [settings.notifications]);

  return null;
};
export default NotificationHandler;
