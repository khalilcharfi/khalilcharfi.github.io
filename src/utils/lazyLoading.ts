// Lazy Loading Utilities
import { lazy, ComponentType } from 'react';

// Lazy load heavy Three.js components
export const LazyThreeBackground = lazy(() => 
  import('../components/ThreeBackground').then(module => ({ default: module.ThreeBackground }))
);

// Lazy load other components
export const LazyVisitorTypeSelector = lazy(() => import('../../VisitorTypeSelector'));
export const LazyTranslationTest = lazy(() => import('../components/TranslationTest'));

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
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (type) {
    link.type = type;
  }
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

// Preload critical chunks
export const preloadCriticalChunks = () => {
  // Preload critical vendor chunks
  const criticalChunks = [
    { href: '/assets/react-vendor.js', as: 'script' },
    { href: '/assets/index.css', as: 'style' }
  ];
  
  criticalChunks.forEach(({ href, as }) => {
    preloadResource(href, as);
  });
};

// Conditionally preload Three.js if user hasn't opted out
export const conditionallyPreloadThreeJS = () => {
  // Check user preference or device capability
  const userPreference = localStorage.getItem('enableAnimations');
  const hasGoodConnection = navigator.connection 
    ? (navigator.connection as any).effectiveType !== 'slow-2g' && (navigator.connection as any).effectiveType !== '2g'
    : true;
  
  if (userPreference !== 'false' && hasGoodConnection) {
    // Preload Three.js chunk after critical resources
    setTimeout(() => {
      preloadResource('/assets/three-vendor.js', 'script');
    }, 1000);
  }
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      
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
  LazyThreeBackground,
  LazyVisitorTypeSelector,
  LazyTranslationTest,
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker
};