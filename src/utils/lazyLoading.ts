// Lazy Loading Utilities
import { lazy } from 'react';

// Lazy load other components
export const LazyVisitorTypeSelector = lazy(() => import('../components/VisitorTypeSelector'));

// Conditional lazy loading for TranslationTest - only load in development when debug is enabled
export const LazyTranslationTest = lazy(() => {
  if (process.env.VITE_SHOW_TRANSLATION_DEBUG === 'true' && process.env.NODE_ENV === 'development') {
    return import('../components/TranslationTest');
  }
  // Return empty component if not in debug mode
  return Promise.resolve({ default: () => null });
});

// Lazy load ThreeBackground component - saves ~166KB gzipped
export const LazyThreeBackground = lazy(() => import('../components/ThreeBackground'));

// Conditional lazy loading for AI - only load when chatbot is enabled
let aiModulePromise: Promise<any> | null = null;

export const loadAIModule = () => {
  if (!aiModulePromise) {
    aiModulePromise = import('@google/genai').catch((error) => {
      console.warn('Failed to load AI module:', error);
      return null;
    });
  }
  return aiModulePromise;
};

// Preload function for critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  // Check if already preloaded
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'modulepreload'; // Use modulepreload for better ES module support
  link.href = href;
  
  if (type) {
    link.type = type;
  }
  
  if (as === 'font') {
    link.rel = 'preload';
    link.as = 'font';
    link.crossOrigin = 'anonymous';
  }
  
  // Only add to DOM if we're actually going to use it soon
  document.head.appendChild(link);
};

// Preload critical chunks
export const preloadCriticalChunks = () => {
  // Only preload in production when chunks actually exist
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Skipping chunk preload in development mode');
    return;
  }
  
  // Preload critical vendor chunks
  const criticalChunks = [
    { href: '/assets/react-vendor.js', as: 'script' },
    { href: '/assets/index.css', as: 'style' }
  ];
  
  criticalChunks.forEach(({ href, as }) => {
    preloadResource(href, as);
  });
};

// Conditionally preload Three.js based on device capabilities
export const conditionallyPreloadThreeJS = () => {
  if (typeof window === 'undefined') return;
  
  // Check device capabilities
  const memory = (navigator as any).deviceMemory;
  const connection = (navigator as any).connection;
  const cores = navigator.hardwareConcurrency;
  
  // Check user preference
  const userPreference = localStorage.getItem('enableAnimations');
  
  // Only preload on capable devices
  const shouldPreload = (
    userPreference !== 'false' &&
    (!memory || memory >= 4) &&
    (!cores || cores >= 4) &&
    (!connection || !['slow-2g', '2g'].includes(connection.effectiveType))
  );
  
  if (shouldPreload) {
    // Preload Three.js on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('three').catch(console.error);
        // Only preload the vendor chunk in production
        if (process.env.NODE_ENV === 'production') {
          preloadResource('/assets/three-vendor.js', 'script');
        }
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        import('three').catch(console.error);
        // Only preload the vendor chunk in production
        if (process.env.NODE_ENV === 'production') {
          preloadResource('/assets/three-vendor.js', 'script');
        }
      }, 2000);
    }
  }
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found');
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, prompt user to refresh
            if (confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
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
