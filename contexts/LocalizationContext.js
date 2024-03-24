import React, { createContext, useEffect, useContext, useReducer } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { storeData, getData, deleteData } from "../utils/utils";

import en from "../localization/en.json";
import fi from "../localization/fi.json";

const translations = {
  en: { translation: en },
  fi: { translation: fi },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: translations,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const LocalizationContext = createContext();

const initialState = {
  languageTag: "en",
  textDirection: en.textDirection,
  measurementSystem: en.measurementSystem,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCALE":
      const { languageTag } = action.payload;
      return {
        ...state,
        languageTag,
        textDirection:
          translations[languageTag]?.translation?.textDirection || "ltr",
        measurementSystem:
          translations[languageTag]?.translation?.measurementSystem || "metric",
      };
    default:
      return state;
  }
};

export const LocalizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const startup = async () => {
      console.log(Localization.getLocales()[0]);
      const locale =
        (await getData("locale")) || Localization.getLocales()[0].languageTag;
      dispatch({ type: "SET_LOCALE", payload: { languageTag: locale } });
    };
    startup();
  }, []);

  useEffect(() => {
    console.log("state", state.languageTag);
    i18n.changeLanguage(state.languageTag);
  }, [state]);

  const setLanguage = (newLocale) => {
    dispatch({ type: "SET_LOCALE", payload: { languageTag: newLocale } });
  };

  const { t } = i18n;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(state.languageTag);
  };

  const formatNumber = (number) => {
    return number.toLocaleString(state.languageTag);
  };

  const getTextDirection = () => {
    return state.textDirection;
  };

  const getMeasurementSystem = () => {
    return state.measurementSystem;
  };

  return (
    <LocalizationContext.Provider
      value={{
        locale: state,
        setLanguage,
        t,
        formatDate,
        formatNumber,
        getTextDirection,
        getMeasurementSystem,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
