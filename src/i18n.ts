import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importowanie plików tłumaczeń
import translationEN from './locales/en/translation.json';
import translationPL from './locales/pl/translation.json';

// Definicja zasobów tłumaczeń
const resources = {
  en: {
    translation: translationEN,
  },
  pl: {
    translation: translationPL,
  },
};

// Inicjalizacja i18n
i18n
  .use(initReactI18next) // Integracja z React
  .init({
    resources,
    lng: 'pl', // Język domyślny
    fallbackLng: 'en', // Język zapasowy

    keySeparator: false, // Używamy prostych kluczy

    interpolation: {
      escapeValue: false, // React zabezpiecza przed XSS
    },
  });

export default i18n;
