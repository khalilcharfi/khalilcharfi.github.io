// Main components
export { AIChatBox } from './AIChatBox';
export { Chatbot } from './Chatbot';
export { CookieConsentBanner } from './CookieConsentBanner';
export { DynamicContentProvider, useDynamicContent, ProfileInsights, useSectionTracking, SHOW_VISITOR_CONTROLS, SHOW_PROFILE_INSIGHTS, SHOW_TRANSLATION_DEBUG, SHOW_DEBUG_INFO, ENABLE_CHATBOT, IS_DEVELOPMENT, SHOW_RECOMMENDED_SECTIONS } from './DynamicContent';
export { ErrorBoundary } from './ErrorBoundary';
export { Navbar } from './Navbar';
export { SkipLinks } from './SkipLinks';
// ThreeBackground is lazy-loaded only - not exported here to avoid static bundling
export { TranslationTest } from './TranslationTest';
export { VisitorTypeSelector } from './VisitorTypeSelector';

// UI components
export { Section, NavLink, ThemeToggle, LanguageSwitcher } from './ui';

// Icons
export * from './icons';
