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

// Performance severity levels based on DCE configuration
const getPerformanceSeverity = () => {
  const enableDCE = process.env.VITE_ENABLE_DCE === 'true' || 
    (process.env.VITE_ENABLE_DCE === undefined && process.env.NODE_ENV === 'production');
  
  return {
    // When DCE is enabled, use more aggressive performance monitoring
    forcedReflowThreshold: enableDCE ? 16 : 50, // 16ms = 60fps, 50ms = 20fps
    domProcessingThreshold: enableDCE ? 100 : 300, // 100ms vs 300ms
    logLevel: enableDCE ? 'warn' : 'log' as 'log' | 'warn' | 'error',
    enableDetailedMonitoring: enableDCE
  };
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = async () => {
  if (import.meta.env.DEV) {
    performanceLogger.log('🚀 Initializing performance optimizations...');
  }

  // 1. Preload critical resources immediately (production only)
  preloadCriticalChunks();

  // 2. Register service worker (in production only)
  if (process.env.NODE_ENV === 'production') {
    await registerServiceWorker();
    if (import.meta.env.DEV) {
      performanceLogger.log('✅ Service worker registered');
    }
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

  if (import.meta.env.DEV) {
    performanceLogger.log('✅ Performance optimizations initialized');
  }
};

/**
 * Setup performance monitoring and reporting
 */
const setupPerformanceMonitoring = () => {
  const severity = getPerformanceSeverity();
  
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        
        if (severity.enableDetailedMonitoring) {
          const level = lcp > 2500 ? 'warn' : 'log';
          performanceLogger[level]('📊 LCP:', lcp, lcp > 2500 ? '(SLOW)' : '');
        } else {
          performanceLogger.log('📊 LCP:', lcp);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID) - only log once
      let fidLogged = false;
      const fidObserver = new PerformanceObserver((list) => {
        if (!fidLogged) {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            
            if (severity.enableDetailedMonitoring) {
              const level = fid > 100 ? 'warn' : 'log';
              performanceLogger[level]('📊 FID:', fid, fid > 100 ? '(SLOW)' : '');
            } else {
              performanceLogger.log('📊 FID:', fid);
            }
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
          if (severity.enableDetailedMonitoring) {
            const level = clsValue > 0.1 ? 'warn' : 'log';
            performanceLogger[level]('📊 CLS:', clsValue, clsValue > 0.1 ? '(POOR)' : '');
          } else {
            performanceLogger.log('📊 CLS:', clsValue);
          }
        }
      }, { once: true });
    } catch (error) {
      performanceLogger.warn('Performance monitoring not fully supported:', error);
    }
  }

  // Enhanced forced reflow detection
  setupForcedReflowDetection(severity);
  
  // Enhanced DOM processing monitoring
  setupDOMMonitoring(severity);

  // Monitor bundle sizes in development only
  if (import.meta.env.DEV && performance.getEntriesByType) {
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
 * Setup forced reflow detection with DCE severity levels
 */
const setupForcedReflowDetection = (severity: ReturnType<typeof getPerformanceSeverity>) => {
  if (!severity.enableDetailedMonitoring) return;

  let reflowCount = 0;
  let totalReflowTime = 0;

  // Monitor layout thrashing
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        const measure = entry as PerformanceMeasure;
        const duration = measure.duration;
        
        if (duration > severity.forcedReflowThreshold) {
          reflowCount++;
          totalReflowTime += duration;
          
          const level = duration > severity.forcedReflowThreshold * 2 ? 'warn' : 'log';
          performanceLogger[level](
            `🔄 Forced reflow detected: ${duration.toFixed(2)}ms`,
            duration > severity.forcedReflowThreshold * 2 ? '(SEVERE)' : '(MODERATE)'
          );
        }
      }
    }
  });

  observer.observe({ entryTypes: ['measure'] });

  // Report summary on page unload
  window.addEventListener('beforeunload', () => {
    if (reflowCount > 0) {
      const avgReflowTime = totalReflowTime / reflowCount;
      const level = avgReflowTime > severity.forcedReflowThreshold ? 'warn' : 'log';
      performanceLogger[level](
        `🔄 Reflow Summary: ${reflowCount} reflows, avg ${avgReflowTime.toFixed(2)}ms`
      );
    }
  });
};

/**
 * Setup DOM processing monitoring with DCE severity levels
 */
const setupDOMMonitoring = (severity: ReturnType<typeof getPerformanceSeverity>) => {
  if (!severity.enableDetailedMonitoring) return;


  // Monitor DOM processing time
  const measureDOMProcessing = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const domProcessing = navigation.domComplete - navigation.domContentLoadedEventStart;
      
      const level = domProcessing > severity.domProcessingThreshold ? 'warn' : 'log';
      performanceLogger[level](
        `🏗️ DOM Processing: ${domProcessing}ms`,
        domProcessing > severity.domProcessingThreshold ? '(SLOW)' : ''
      );
    }
  };

  // Measure on load
  window.addEventListener('load', () => {
    setTimeout(measureDOMProcessing, 100);
  });

  // Monitor DOM mutations that might cause performance issues
  if ('MutationObserver' in window) {
    let mutationCount = 0;
    let lastMutationTime = 0;

    const mutationObserver = new MutationObserver(() => {
      const now = performance.now();
      mutationCount++;
      
      // Check for rapid mutations (potential performance issue)
      if (now - lastMutationTime < 16) { // Less than one frame
        const level = mutationCount > 10 ? 'warn' : 'log';
        performanceLogger[level](
          `🔧 Rapid DOM mutations detected: ${mutationCount} in ${(now - lastMutationTime).toFixed(2)}ms`
        );
      }
      
      lastMutationTime = now;
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Reset mutation count periodically
    setInterval(() => {
      if (mutationCount > 0) {
        const level = mutationCount > 50 ? 'warn' : 'log';
        performanceLogger[level](`🔧 DOM Mutations: ${mutationCount} in last 5s`);
        mutationCount = 0;
      }
    }, 5000);
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
 * Report performance metrics to console (or analytics) with DCE severity levels
 */
export const reportPerformanceMetrics = () => {
  const severity = getPerformanceSeverity();
  
  // Use modern PerformanceNavigationTiming API
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return;

  const metrics = {
    'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
    'TCP Connection': navigation.connectEnd - navigation.connectStart,
    'Server Response': navigation.responseEnd - navigation.requestStart,
    'DOM Processing': navigation.domComplete - navigation.domContentLoadedEventStart,
    'Total Load Time': navigation.loadEventEnd - navigation.fetchStart
  };

  // Only log performance metrics in development
  if (import.meta.env.DEV) {
    // Check for performance issues and use appropriate severity
    const domProcessing = metrics['DOM Processing'];
    const totalLoadTime = metrics['Total Load Time'];
    
    if (severity.enableDetailedMonitoring) {
      const hasIssues = domProcessing > severity.domProcessingThreshold || totalLoadTime > 3000;
      const level = hasIssues ? 'warn' : 'log';
      
      performanceLogger[level]('📊 Performance Metrics:', metrics);
      
      if (domProcessing > severity.domProcessingThreshold) {
        performanceLogger.warn(`⚠️ DOM Processing exceeded threshold: ${domProcessing}ms > ${severity.domProcessingThreshold}ms`);
      }
      
      if (totalLoadTime > 3000) {
        performanceLogger.warn(`⚠️ Total Load Time exceeded threshold: ${totalLoadTime}ms > 3000ms`);
      }
    } else {
      // Standard logging when DCE is disabled
      performanceLogger.log('📊 Performance Metrics:', metrics);
    }
    
    // Show formatted table in development
    console.table(metrics);
  }
};

export default {
  initializePerformanceOptimizations,
  canHandleHeavyAnimations,
  getOptimalParticleCount,
  reportPerformanceMetrics
};

