import { lazy, type ComponentType } from 'react';
import { logger, chatbotLogger } from './logger';
import { loadingManager, ResourceLoader } from './loadingManager';

export const LazyVisitorTypeSelector = lazy(() => 
  import('../../features/visitor-personalization').then(m => ({ default: m.VisitorTypeSelector }))
);

// TranslationTest - production-safe implementation that avoids circular dependencies
// Use a simple inline component in production, dynamic import only in development
const EmptyComponent = () => null;

export const LazyTranslationTest = import.meta.env.PROD
  ? EmptyComponent as ComponentType<any>
  : lazy(() => 
      import('../../features/i18n/components/TranslationTest')
        .then(m => ({ default: m.TranslationTest }))
        .catch(() => ({ default: EmptyComponent }))
    );

export const LazyThreeBackground = lazy(() => 
  import('../components/feedback/ThreeBackground').then(m => ({ default: m.ThreeBackground }))
);

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
  if (import.meta.env.DEV) {
    logger.log('⚠️ Skipping chunk preload in development mode');
    return;
  }
  
  logger.log('✅ Using Vite-generated modulepreload links for critical chunks');
  loadingManager.incrementProgress('Loading critical resources');
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
    // Defer Three.js loading until after FCP and LCP
    const deferThreeJS = () => {
      // Wait for FCP to complete
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          
          if (fcpEntry) {
            observer.disconnect();
            
            // Wait additional time after FCP before loading Three.js
            setTimeout(() => {
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  import('three')
                    .then(() => {
                      loadingManager.incrementProgress('Three.js loaded');
                      loadingManager.trackResource('loaded');
                    })
                    .catch((error) => {
                      logger.error('Failed to preload Three.js:', error);
                      loadingManager.trackResource('failed');
                    });
                }, { timeout: 2000 });
              } else {
                setTimeout(() => {
                  import('three')
                    .then(() => {
                      loadingManager.incrementProgress('Three.js loaded');
                      loadingManager.trackResource('loaded');
                    })
                    .catch((error) => {
                      logger.error('Failed to preload Three.js:', error);
                      loadingManager.trackResource('failed');
                    });
                  }, 2000);
              }
            }, 1000); // Wait 1 second after FCP
          }
        });
        
        observer.observe({ entryTypes: ['paint'] });
        
        // Fallback timeout in case FCP doesn't fire
        setTimeout(() => {
          observer.disconnect();
          deferThreeJS();
        }, 5000);
      } else {
        // Fallback for browsers without PerformanceObserver
        setTimeout(() => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              import('three')
                .then(() => {
                  loadingManager.incrementProgress('Three.js loaded');
                  loadingManager.trackResource('loaded');
                })
                .catch((error) => {
                  logger.error('Failed to preload Three.js:', error);
                  loadingManager.trackResource('failed');
                });
            }, { timeout: 2000 });
          } else {
            setTimeout(() => {
              import('three')
                .then(() => {
                  loadingManager.incrementProgress('Three.js loaded');
                  loadingManager.trackResource('loaded');
                })
                .catch((error) => {
                  logger.error('Failed to preload Three.js:', error);
                  loadingManager.trackResource('failed');
                });
              }, 2000);
          }
        }, 2000);
      }
    };
    
    deferThreeJS();
  }
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });
      
      logger.log('✅ Service Worker registered:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        logger.log('🔄 Service Worker update found');
        
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New SW installed, but old SW is still controlling the page
              showUpdateNotification(registration);
            } else {
              // First time installation
              logger.log('✅ Service Worker installed for the first time');
            }
          }
        });
      });
      
      // Check for updates periodically (every hour)
      setInterval(() => {
        registration.update().catch(error => {
          logger.warn('Failed to check for SW updates:', error);
        });
      }, 60 * 60 * 1000);
      
      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type === 'SW_UPDATED') {
          logger.log('📦 Service Worker updated to version:', event.data.version);
        }
      });
      
      // Handle controlling SW change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          logger.log('🔄 New Service Worker took control, reloading...');
          window.location.reload();
        }
      });
      
      return registration;
    } catch (error) {
      logger.error('❌ Service Worker registration failed:', error);
    }
  }
};

// Show update notification to user
function showUpdateNotification(registration: ServiceWorkerRegistration) {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'sw-update-banner';
  updateBanner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideUp 0.3s ease-out;
  `;
  
  updateBanner.innerHTML = `
    <div style="flex: 1;">
      <strong style="display: block; margin-bottom: 4px;">🎉 New version available!</strong>
      <span style="font-size: 14px; opacity: 0.9;">Click update to get the latest features</span>
    </div>
    <button id="sw-update-button" style="
      background: white;
      color: #667eea;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    ">Update Now</button>
    <button id="sw-dismiss-button" style="
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    ">Later</button>
  `;
  
  // Add animation keyframes
  if (!document.querySelector('#sw-update-styles')) {
    const style = document.createElement('style');
    style.id = 'sw-update-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(100px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      #sw-update-button:hover {
        transform: scale(1.05);
      }
      #sw-dismiss-button:hover {
        background: rgba(255,255,255,0.1);
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(updateBanner);
  
  // Handle update button
  document.getElementById('sw-update-button')?.addEventListener('click', () => {
    const waitingWorker = registration.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    updateBanner.remove();
  });
  
  // Handle dismiss button
  document.getElementById('sw-dismiss-button')?.addEventListener('click', () => {
    updateBanner.remove();
  });
}

// Default export - conditionally include LazyTranslationTest to avoid circular dependencies
const exports = {
  LazyVisitorTypeSelector,
  loadAIModule,
  preloadResource,
  preloadCriticalChunks,
  conditionallyPreloadThreeJS,
  registerServiceWorker,
  // Only include in development to avoid circular dependency in production
  ...(import.meta.env.DEV ? { LazyTranslationTest } : {})
};

export default exports;
