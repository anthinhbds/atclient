/**
 * @format
 * @description load additional plugins to i18next for the multi language feature
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import { ELanguage } from 'types';
import { resources } from "./resources";
// import { KEY_CONTEXT, parseJSON } from "utils";

// const layout = parseJSON(getKey(KEY_CONTEXT.LAYOUT) ?? '{}',{})

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: "vi",
  //   lng: ELanguage.EN,
  // fallbackLng: ["en", "vi"],
  fallbackLng: ["vi"],
  //   fallbackLng: [ELanguage.VI, ELanguage.EN],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
