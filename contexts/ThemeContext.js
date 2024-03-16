import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeColors } from "../assets/theme/ThemeColors";

const RESET_THEME = "RESET_THEME";
const CHANGE_THEME_COLOR = "CHANGE_THEME_COLOR";
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log(jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(jsonValue);
    console.log(e);
  }
};
const themeReducer = (state, action) => {
  switch (action.type) {
    case RESET_THEME:
      return ThemeColors;
    case CHANGE_THEME_COLOR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, {});

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await getData("theme");
        if (storedTheme !== null) {
          dispatch({
            type: CHANGE_THEME_COLOR,
            payload: storedTheme,
          });
        } else {
          dispatch({ type: RESET_THEME });
        }
      } catch (error) {
        console.error(
          "Error loading theme, will fallback to the default:",
          error
        );
        dispatch({ type: RESET_THEME });
      }
    };

    loadTheme();
  }, []);

  const resetTheme = () => {
    dispatch({ type: RESET_THEME });
  };

  const changeThemeColor = (colors) => {
    dispatch({ type: CHANGE_THEME_COLOR, payload: colors });
  };

  return (
    <ThemeContext.Provider value={{ theme, resetTheme, changeThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
