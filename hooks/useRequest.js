import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
export default function useRequest(token = null) {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const fetcher = async ({
    url,
    reqMethod,
    object = null,
    errorMessage = null,
    successMessage = null,
    showLoading = false,
  }) => {
    if (showLoading) {
      startLoading();
    }
    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Token ${token}`;
      }
      console.log(headers.Authorization);
      const response = await fetch(url, {
        method: reqMethod,
        headers:
          object instanceof FormData
            ? headers
            : {
                "Content-Type": "application/json",
                ...headers,
              },
        body: object
          ? object instanceof FormData
            ? object
            : JSON.stringify(object)
          : null,
      });

      if (!response.ok) {
        console.log("response with error:", response.status);
        if (errorMessage) {
          setError(errorMessage);
        }
        if (showLoading) {
          stopLoading();
        }
        return null;
      }
      if (successMessage) {
        setSuccess(successMessage);
      }
      if (showLoading) {
        stopLoading();
      }
      res = await response.json();
      return res;
    } catch (err) {
      console.log(err);
      if (errorMessage) {
        setError(errorMessage);
      }
      if (showLoading) {
        stopLoading();
      }
      return null;
    }
  };
  return { fetcher };
}
