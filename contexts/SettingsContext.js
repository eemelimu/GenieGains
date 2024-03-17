import React, { createContext, useState, useContext, useEffect } from "react";
import { storeData, getData } from "../utils/utils";
const SettingsContext = createContext();

const ENABLE_NOTIFICATIONS = "ENABLE_NOTIFICATIONS";
const DISABLE_NOTIFICATIONS = "DISABLE_NOTIFICATIONS";
const ENABLE_TIPS = "ENABLE_TIPS";
const DISABLE_TIPS = "DISABLE_TIPS";

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    notifications: false,
    tips: true,
  });

  useEffect(() => {
    const getSettings = async () => {
      const settings = await getData("settings");
      if (settings) {
        setSettings(settings);
      }
    };
    getSettings();
  }, []);

  useEffect(() => {
    storeData("settings", settings);
  }, [settings]);

  const dispatch = (action) => {
    switch (action.type) {
      case ENABLE_NOTIFICATIONS:
        setSettings((prevSettings) => ({
          ...prevSettings,
          notifications: true,
        }));
        break;
      case DISABLE_NOTIFICATIONS:
        setSettings((prevSettings) => ({
          ...prevSettings,
          notifications: false,
        }));
        break;
      case ENABLE_TIPS:
        setSettings((prevSettings) => ({
          ...prevSettings,
          tips: true,
        }));
        break;
      case DISABLE_TIPS:
        setSettings((prevSettings) => ({
          ...prevSettings,
          tips: false,
        }));
        break;
      default:
        break;
    }
  };

  const enableNotifications = () =>
    dispatch({
      type: ENABLE_NOTIFICATIONS,
    });

  const disableNotifications = () =>
    dispatch({
      type: DISABLE_NOTIFICATIONS,
    });

  const enableTips = () =>
    dispatch({
      type: ENABLE_TIPS,
    });

  const disableTips = () =>
    dispatch({
      type: DISABLE_TIPS,
    });

  return (
    <SettingsContext.Provider
      value={{
        settings,
        enableNotifications,
        disableNotifications,
        enableTips,
        disableTips,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
export const useSettings = () => {
  return useContext(SettingsContext);
};
