export { default as i18n, t, getCurrentLanguage, getBaseLanguage, isLanguageSupported, getSupportedLanguages, changeLanguage, validateTranslations } from './i18n.config';
export * from './data/translations';
export * from './hooks/useTranslation';
export * from './utils/translationValidator';
export { TranslationTest } from './components/TranslationTest';