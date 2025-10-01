import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '../../translations';

// Transform the translations into the format i18next expects
const resources: { [key: string]: { translation: any } } = {};
Object.keys(translations).forEach((lang) => {
  resources[lang] = {
    translation: translations[lang],
  };
});

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      
      // Look for language in URL parameter
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Check for language in localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Check for language in navigator
      checkWhitelist: true,
    },
    
    // Language switching configuration
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Key separator
    keySeparator: '.',
    
    // Namespace separator
    nsSeparator: ':',
  });

// Export the configured i18n instance
export default i18n;

// Export translation function for direct use
export const t = (key: string, options?: any) => i18n.t(key, options);

// Export language utilities
export const getCurrentLanguage = () => i18n.language;
export const getBaseLanguage = (lang?: string) => (lang || i18n.language)?.split('-')[0] || 'en';
export const isLanguageSupported = (lang: string) => Object.keys(translations).includes(lang);
export const getSupportedLanguages = () => Object.keys(translations);

// Language change utility
export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

// Translation validation utility
export const validateTranslations = () => {
  const missingKeys: { [lang: string]: string[] } = {};
  const supportedLangs = getSupportedLanguages();
  const baseLang = 'en';
  
  // Get all keys from the base language
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

// Helper function to get all nested keys
const getAllKeys = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
};

// Export types
export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = string;
