/**
 * Performance Initialization Module
 * Handles service worker registration, preloading, and performance monitoring
 */

import { 
  registerServiceWorker, 
  preloadCriticalChunks, 
  conditionallyPreloadThreeJS 
} from './lazyLoading';

import { setupImageLazyLoading } from './imageOptimization';
import { performanceLogger } from './logger';

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = async () => {
  performanceLogger.log('🚀 Initializing performance optimizations...');

  // 1. Preload critical resources immediately (production only)
  preloadCriticalChunks();

  // 2. Register service worker (in production only)
  if (process.env.NODE_ENV === 'production') {
    await registerServiceWorker();
    performanceLogger.log('✅ Service worker registered');
  }

  // 3. Conditionally preload Three.js based on device capabilities
  conditionallyPreloadThreeJS();

  // 4. Setup performance monitoring
  setupPerformanceMonitoring();

  // 5. Setup resource hints
  setupResourceHints();

  // 6. Setup image lazy loading
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      setupImageLazyLoading();
    });
  } else {
    setTimeout(() => {
      setupImageLazyLoading();
    }, 1000);
  }

  performanceLogger.log('✅ Performance optimizations initialized');
};

/**
 * Setup performance monitoring and reporting
 */
const setupPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        performanceLogger.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID) - only log once
      let fidLogged = false;
      const fidObserver = new PerformanceObserver((list) => {
        if (!fidLogged) {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            performanceLogger.log('📊 FID:', fid);
            fidLogged = true;
            break;
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS) - only log final value
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      
      // Log final CLS on page hide
      window.addEventListener('pagehide', () => {
        if (clsValue > 0) {
          performanceLogger.log('📊 CLS:', clsValue);
        }
      }, { once: true });
    } catch (error) {
      performanceLogger.warn('Performance monitoring not fully supported:', error);
    }
  }

  // Monitor bundle sizes in development only
  if (performance.getEntriesByType) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const scripts = resources.filter(r => r.name.includes('.js'));
        const totalScriptSize = scripts.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        performanceLogger.log('📦 Total JS Size:', (totalScriptSize / 1024 / 1024).toFixed(2), 'MB');
      }, 1000);
    });
  }
};

/**
 * Setup DNS prefetch and preconnect for external resources
 */
const setupResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
  ];

  hints.forEach(({ rel, href, crossOrigin }) => {
    if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
    }
  });
};

/**
 * Check if device can handle heavy animations
 */
export const canHandleHeavyAnimations = (): boolean => {
  // Check device memory
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) {
    return false;
  }

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) {
    return false;
  }

  // Check connection
  const connection = (navigator as any).connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return false;
    }
  }

  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  return true;
};

/**
 * Get optimal particle count based on device capabilities
 */
export const getOptimalParticleCount = (): number => {
  if (!canHandleHeavyAnimations()) {
    return 1000; // Low-end devices
  }

  const memory = (navigator as any).deviceMemory;
  if (memory) {
    if (memory >= 8) return 5000; // High-end
    if (memory >= 4) return 3000; // Mid-range
    return 1500; // Low-mid range
  }

  return 3000; // Default
};

/**
 * Report performance metrics to console (or analytics)
 */
export const reportPerformanceMetrics = () => {
  if (!performance.timing) return;

  const timing = performance.timing;
  const metrics = {
    'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
    'TCP Connection': timing.connectEnd - timing.connectStart,
    'Server Response': timing.responseEnd - timing.requestStart,
    'DOM Processing': timing.domComplete - timing.domLoading,
    'Total Load Time': timing.loadEventEnd - timing.navigationStart
  };

  console.table(metrics);
};

export default {
  initializePerformanceOptimizations,
  canHandleHeavyAnimations,
  getOptimalParticleCount,
  reportPerformanceMetrics
};

