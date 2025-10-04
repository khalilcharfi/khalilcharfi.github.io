// Service exports
export { 
  UserAnalytics,
  useUserAnalytics,
  detectVisitorType,
  generatePersonalizedContent,
  EnhancedUserAnalytics,
  analytics
} from './userAnalytics';

// Google Analytics exports
export {
  googleAnalytics,
  GoogleAnalyticsService,
  initGA,
  updateGAConsent,
  trackPageView,
  trackEvent,
  setUserProperties
} from './googleAnalytics';

export type {
  AnalyticsConfig,
  AnalyticsEvent,
  PageViewEvent,
  UserProperties
} from './googleAnalytics';
