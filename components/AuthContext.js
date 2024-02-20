// AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const res = await fetch("http://localhost:8000/token_login", {
            method: "POST",
            headers: {
              "Auth-Token": token,
            },
          });
          const ok = res.status === 200;
          console.log("token check is :", ok);
          if (ok) {
            dispatch({ type: "LOGIN", payload: { token } });
            navigation.navigate("Home");
          } else {
            await AsyncStorage.removeItem("token");
            throw new Error("Invalid token");
          }
        } else {
          throw new Error("No token in local db");
        }
      } catch (error) {
        dispatch({ type: "LOGOUT" });
        console.error("Error initializing auth:", error);
        navigation.navigate("Login");
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        if (state.isAuthenticated) {
          await AsyncStorage.setItem("token", state.token);
          navigation.navigate("Home");
        } else {
          await AsyncStorage.removeItem("token");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error handling auth change:", error);
      }
    };

    handleAuthChange();
  }, [state.isAuthenticated, state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
