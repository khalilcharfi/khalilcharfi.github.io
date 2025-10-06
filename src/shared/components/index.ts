export { Navbar } from './layout/Navbar';
export { SkipLinks } from './navigation/SkipLinks';
export { ErrorBoundary, AnalyticsErrorBoundary, withErrorBoundary } from './feedback/ErrorBoundary';
export { CustomCursor } from './feedback/CustomCursor';
export { ThreeBackground } from './feedback/ThreeBackground';
export * from './icons';
export * from './debug';

// Re-export from features for convenience
export { SEOHead } from '../../features/seo';
export { Chatbot } from '../../features/chatbot';

// Re-export UI components
export { Section } from '../ui';