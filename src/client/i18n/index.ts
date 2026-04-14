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

// Idempotently injects the Noto Sans JP stylesheet when the UI switches to ja.
// The initial load path is handled by an inline script in index.html so the
// font starts downloading during HTML parsing instead of after JS boots.
const loadJapaneseFont = () => {
  if (document.getElementById('noto-sans-jp-font')) return;
  const link = document.createElement('link');
  link.id = 'noto-sans-jp-font';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap';
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('devcard-locale', lng);
  if (lng === 'ja') loadJapaneseFont();
});

export default i18n;
