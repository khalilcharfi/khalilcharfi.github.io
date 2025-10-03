// Utility exports
export { AdvancedFingerprintCollector, advancedFingerprinter } from './advancedFingerprinting';
export { 
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker
} from './lazyLoading';
export {
  initializePerformanceOptimizations,
  canHandleHeavyAnimations,
  getOptimalParticleCount,
  reportPerformanceMetrics
} from './performanceInit';
export {
  validateAllTranslations,
  validateLanguage,
  generateValidationReport,
  autoFixTranslations
} from './translationValidator';
