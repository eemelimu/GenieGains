// AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getData, storeData, deleteData } from "../assets/utils/utils";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "../assets/config";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: null,
  isLoading: true,
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
    case "STOPPED_LOADING":
      return {
        ...state,
        isLoading: false,
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
        const token = await getData("token");
        if (token) {
          const res = await fetch(BACKEND_URL + "token_login", {
            method: "POST",
            headers: {
              "Auth-Token": token,
            },
          });

          const ok = res.status === 200;
          console.log("token check is :", ok);
          if (ok) {
            dispatch({ type: "LOGIN", payload: { token } });
            dispatch({ type: "STOPPED_LOADING" });
          } else {
            await AsyncStorage.removeItem("token");
            dispatch({ type: "STOPPED_LOADING" });
            console.log("Invalid token");
          }
        } else {
          dispatch({ type: "STOPPED_LOADING" });
          dispatch({ type: "LOGOUT" });
          console.log("No token in local db");
        }
      } catch (error) {
        dispatch({ type: "STOPPED_LOADING" });
        dispatch({ type: "LOGOUT" });
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      console.log("Auth state changed:", state.isAuthenticated);
      console.log("Auth is loading:", state.isLoading);
      if (state.isLoading) {
        return;
      }
      try {
        if (state.isAuthenticated) {
          storeData("token", state.token);
          navigation.navigate("Home");
        } else {
          deleteData("token");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error handling auth change:", error);
      }
    };

    handleAuthChange();
  }, [state.isAuthenticated, state.token, state.isLoading]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
