import { lazy } from 'react';
import { logger, chatbotLogger } from './logger';

export const LazyVisitorTypeSelector = lazy(() => import('../../features/visitor-personalization').then(m => ({ default: m.VisitorTypeSelector })));

export const LazyTranslationTest = lazy(() => {
  if (import.meta.env.DEV || import.meta.env.VITE_SHOW_TRANSLATION_DEBUG === 'true') {
    return import('../../features/i18n').then(m => ({ default: m.TranslationTest }));
  }
  return Promise.resolve({ 
    default: () => null 
  }) as Promise<{ default: React.ComponentType<any> }>;
});

export const LazyThreeBackground = lazy(() => import('../components/feedback/ThreeBackground').then(m => ({ default: m.ThreeBackground })));

let aiModulePromise: Promise<any> | null = null;

export const loadAIModule = () => {
  if (!aiModulePromise) {
    aiModulePromise = import('@google/genai').catch((error) => {
      chatbotLogger.warn('Failed to load AI module:', error);
      return null;
    });
  }
  return aiModulePromise;
};

export const preloadResource = (href: string, as: string, type?: string) => {
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = href;
  
  if (type) {
    link.type = type;
  }
  
  if (as === 'font') {
    link.rel = 'preload';
    link.as = 'font';
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

export const preloadCriticalChunks = () => {
  if (process.env.NODE_ENV !== 'production') {
    logger.log('⚠️ Skipping chunk preload in development mode');
    return;
  }
  
  logger.log('✅ Using Vite-generated modulepreload links for critical chunks');
};

export const conditionallyPreloadThreeJS = () => {
  if (typeof window === 'undefined') return;
  
  const memory = (navigator as any).deviceMemory;
  const connection = (navigator as any).connection;
  const cores = navigator.hardwareConcurrency;
  
  const userPreference = localStorage.getItem('enableAnimations');
  
  const shouldPreload = (
    userPreference !== 'false' &&
    (!memory || memory >= 4) &&
    (!cores || cores >= 4) &&
    (!connection || !['slow-2g', '2g'].includes(connection.effectiveType))
  );
  
  if (shouldPreload) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('three').catch((error) => logger.error('Failed to preload Three.js:', error));
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        import('three').catch((error) => logger.error('Failed to preload Three.js:', error));
      }, 2000);
    }
  }
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      logger.log('✅ Service Worker registered:', registration.scope);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        logger.log('Service Worker update found');
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      logger.error('Service Worker registration failed:', error);
    }
  }
};

export default {
  LazyVisitorTypeSelector,
  LazyTranslationTest,
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker
};
