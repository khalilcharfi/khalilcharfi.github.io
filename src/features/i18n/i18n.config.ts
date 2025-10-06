import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './data/translations';

const resources: { [key: string]: { translation: any } } = {};
Object.keys(translations).forEach((lang) => {
  resources[lang] = {
    translation: translations[lang],
  };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
    },
    react: {
      useSuspense: false,
    },
    defaultNS: 'translation',
    ns: ['translation'],
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    pluralSeparator: '_',
    contextSeparator: '_',
    keySeparator: '.',
    nsSeparator: ':',
  });

export default i18n;

export const t = (key: string, options?: any) => i18n.t(key, options);

export const getCurrentLanguage = () => i18n.language;
export const getBaseLanguage = (lang?: string) => (lang || i18n.language)?.split('-')[0] || 'en';
export const isLanguageSupported = (lang: string) => Object.keys(translations).includes(lang);
export const getSupportedLanguages = () => Object.keys(translations);

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

export const validateTranslations = () => {
  const missingKeys: { [lang: string]: string[] } = {};
  const supportedLangs = getSupportedLanguages();
  const baseLang = 'en';
  
  const getAllKeys = (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };
  
  const baseKeys = getAllKeys(translations[baseLang]);
  
  supportedLangs.forEach(lang => {
    if (lang === baseLang) return;
    
    const langKeys = getAllKeys(translations[lang]);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missing.length > 0) {
      missingKeys[lang] = missing;
    }
  });
  
  return missingKeys;
};
