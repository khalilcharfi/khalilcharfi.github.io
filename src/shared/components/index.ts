export { Navbar } from './layout/Navbar';
export { SkipLinks } from './navigation/SkipLinks';
export { ErrorBoundary, AnalyticsErrorBoundary, withErrorBoundary } from './feedback/ErrorBoundary';
export { CustomCursor } from './feedback/CustomCursor';
export { ThreeBackground } from './feedback/ThreeBackground';
export * from './icons';

// Conditionally export debug components only in development
// Use dynamic imports instead of conditional exports
export const getDebugComponents = () => {
  if (import.meta.env.DEV) {
    return import('./debug');
  }
  return Promise.resolve({});
};

// Re-export from features for convenience
export { SEOHead } from '../../features/seo';
export { Chatbot } from '../../features/chatbot';

// Re-export UI components
export { Section } from '../ui';