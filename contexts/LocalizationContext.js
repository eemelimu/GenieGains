import React, { createContext, useEffect, useContext, useReducer } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { storeData, getData, deleteData } from "../utils/utils";

import en from "../localization/en.json";
import fi from "../localization/fi.json";
import ja from "../localization/ja.json";
import i18next from "i18next";

const translations = {
  en: { translation: en },
  fi: { translation: fi },
  ja: { translation: ja },
};

export const supportedLanguages = [
  { label: "English", value: "en" },
  { label: "Suomi", value: "fi" },
  { label: "日本語", value: "ja" },
];

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
      let measurements =
        translations[languageTag]?.translation?.measurementSystem;
      if (measurements == null) {
        let language = languageTag.split("-")[1];
        measurements = translations[language]?.translation?.measurementSystem;
        if (measurements == null) {
          language = languageTag.split("-")[0];
          measurements = translations[language]?.translation?.measurementSystem;
          if (measurements == null) {
            measurements = "metric";
          }
        }
      }
      return {
        ...state,
        languageTag,
        textDirection: i18next.dir(languageTag) || "ltr",
        measurementSystem: measurements || "metric",
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
  const reset = async () => {
    await deleteData("locale");
    dispatch({
      type: "SET_LOCALE",
      payload: {
        languageTag: Localization.getLocales()[0].languageTag || "en",
      },
    });
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
        reset,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
