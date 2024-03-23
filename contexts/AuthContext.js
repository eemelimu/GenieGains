// AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getData, storeData, deleteData } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../assets/config";
import { ThemeContext } from "./ThemeContext";
import { useSettings } from "./SettingsContext";
const AuthContext = createContext();

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const STOPPED_LOADING = "STOPPED_LOADING";
const START_LOADING = "START_LOADING";

const initialState = {
  isAuthenticated: false,
  token: null,
  isLoading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    case STOPPED_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const { resetTheme, theme: ThemeColors } = useContext(ThemeContext);
  const { resetSettings } = useSettings();
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getData("token");
        if (token) {
          const res = await fetch(BACKEND_URL + "token_login", {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          const ok = res.status === 200;
          console.log("token check with token is :", token, ok);
          if (ok) {
            dispatch({ type: LOGIN, payload: { token } });
          } else {
            deleteData("token");
            console.log("Invalid token");
          }
        } else {
          dispatch({ type: LOGOUT });
          console.log("No token in local db");
        }
      } catch (error) {
        dispatch({ type: LOGOUT });
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      console.log("Auth state changed:", state.isAuthenticated);
      console.log("Auth is loading:", state.isLoading);
      console.log("Auth token:", state.token);
      if (state.isLoading) {
        return;
      }
      try {
        if (state.isAuthenticated) {
          storeData("token", state.token);
          navigation.navigate("Home");
        } else {
          deleteData("token");
          resetTheme();
          storeData("theme", ThemeColors);
          resetSettings();
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error handling auth change:", error);
      }
    };

    handleAuthChange();
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
