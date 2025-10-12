// Utility exports
export { 
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker,
  LazyThreeBackground,
  LazyVisitorTypeSelector
} from './lazyLoading';

// LazyTranslationTest is NOT re-exported to avoid circular dependencies
// Import directly from './lazyLoading' if needed in development
export {
  loadingManager,
  useLoadingManager,
  ResourceLoader,
  loadImageWithProgress,
  isResourceCached
} from './loadingManager';
export type {
  LoadingState,
  LoadingProgress,
  LoadingMetrics
} from './loadingManager';
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
