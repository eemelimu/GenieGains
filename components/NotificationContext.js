import { STOP } from "gifted-charts-core";
import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

// Action types
const SET_MESSAGE = "SET_MESSAGE";
const SET_ERROR = "SET_ERROR";
const START_LOADING = "START_LOADING";
const STOP_LOADING = "STOP_LOADING";
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    error: "",
    isLoading: false,
    success: "",
  });

  const dispatch = (action) => {
    switch (action.type) {
      case SET_MESSAGE:
        setNotification((prevNotification) => ({
          ...prevNotification,
          success: action.payload.message,
          error: "",
          isLoading: false,
        }));
        break;
      case SET_ERROR:
        setNotification((prevNotification) => ({
          ...prevNotification,
          error: action.payload.error,
          success: "",
          isLoading: false,
        }));
        break;
      case START_LOADING:
        setNotification((prevNotification) => ({
          ...prevNotification,
          isLoading: true,
          success: "",
          error: "",
        }));
        break;
      case STOP_LOADING:
        setNotification((prevNotification) => ({
          ...prevNotification,
          isLoading: false,
          success: "",
          error: "",
        }));
      default:
        break;
    }
  };

  const setSuccess = (message) =>
    dispatch({
      type: SET_MESSAGE,
      payload: { message },
    });

  const setError = (error) =>
    dispatch({
      type: SET_ERROR,
      payload: { error },
    });

  const startLoading = () =>
    dispatch({
      type: START_LOADING,
    });
  const stopLoading = () =>
    dispatch({
      type: STOP_LOADING,
    });

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setSuccess,
        setError,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
