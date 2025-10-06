// Utility exports
export { 
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker,
  LazyTranslationTest,
  LazyThreeBackground,
  LazyVisitorTypeSelector
} from './lazyLoading';
export {
  initializePerformanceOptimizations,
  canHandleHeavyAnimations,
  getOptimalParticleCount,
  reportPerformanceMetrics
} from './performanceInit';
export { smoothScrollTo } from './navigation';
export { logger, analyticsLogger, i18nLogger, performanceLogger, chatbotLogger, threeLogger } from './logger';
export {
  retryAsync,
  trackError,
  safeAsync,
  safeSync,
  createDebouncedErrorHandler,
  isNetworkError,
  isTimeoutError,
  isRetryableError,
  createTimeout,
  withTimeout,
  type RetryOptions,
  type ErrorTrackingOptions
} from './errorTracking';

// Re-export from features
export { AdvancedFingerprintCollector, advancedFingerprinter } from '../../features/analytics';
export {
  validateAllTranslations,
  validateLanguage,
  generateValidationReport,
  autoFixTranslations
} from '../../features/i18n';
