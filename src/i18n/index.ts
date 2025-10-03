// i18n.ts - Enhanced Internationalization Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '../data/translations';

// Transform the translations into the format i18next expects
const resources: { [key: string]: { translation: any } } = {};
Object.keys(translations).forEach((lang) => {
  resources[lang] = {
    translation: translations[lang],
  };
});

// Enhanced i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // React configuration
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes by default
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      },
    },
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🌐 Missing translation key: "${key}" for language: "${lng}"`);
        console.warn(`   Fallback value: "${fallbackValue}"`);
      }
    },
    
    // Key configuration
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Load path configuration
    load: 'languageOnly',
    
    // Backend configuration for future use
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

// Export the configured i18n instance
export default i18n;

// Export utility functions
export const getCurrentLanguage = () => i18n.language;
export const getBaseLanguage = (lang?: string) => (lang || i18n.language)?.split('-')[0] || 'en';
export const isLanguageSupported = (lang: string) => Object.keys(translations).includes(lang);
export const getSupportedLanguages = () => Object.keys(translations);

// Enhanced language change utility
export const changeLanguage = async (lang: string) => {
  try {
    if (!isLanguageSupported(lang)) {
      console.warn(`Language "${lang}" is not supported. Falling back to English.`);
      lang = 'en';
    }
    
    await i18n.changeLanguage(lang);
    
    // Update document language attribute
    const baseLang = getBaseLanguage(lang);
    document.documentElement.lang = baseLang;
    
    // Update document direction for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(baseLang) ? 'rtl' : 'ltr';
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang, baseLanguage: baseLang } 
    }));
    
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

// Initialize document language and direction on load
if (typeof document !== 'undefined') {
  const baseLang = getBaseLanguage();
  document.documentElement.lang = baseLang;
  
  // Set initial direction
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  document.documentElement.dir = rtlLanguages.includes(baseLang) ? 'rtl' : 'ltr';
}
