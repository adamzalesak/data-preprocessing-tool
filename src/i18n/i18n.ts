import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translation from './locales/en.json';
import * as czechTranslation from './locales/cs.json';

export const resources = {
  en: {
    translation,
  },
  cs: {
    translation: czechTranslation,
  },
} as const;

i18next
  .use(LocalStorageBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: [
        'localStorage',
        'navigator', // browser language
      ],
    },
    returnNull: false,
  });

export default i18next;

