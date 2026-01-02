import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('devcard-locale') : null;

const browserLocale = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: savedLocale || (browserLocale === 'ja' ? 'ja' : 'en'),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('devcard-locale', lng);
});

export default i18n;
