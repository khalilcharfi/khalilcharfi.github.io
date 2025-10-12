// Re-export from features (excluding chatbot to avoid circular dependency)
export { useTranslation } from '../../features/i18n';
export { useGoogleAnalytics } from '../../features/analytics';
// Note: chatbot hooks should be imported directly from @/features/chatbot to avoid circular deps

// Local hooks
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useWASMPerformanceMonitor } from './useWASMPerformanceMonitor';
export * from './useAccessibility';
