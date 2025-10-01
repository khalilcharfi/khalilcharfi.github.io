#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Implements key performance optimizations for the portfolio website
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Performance Optimization...\n');

// 1. Create Service Worker for Caching
const createServiceWorker = () => {
  const swContent = `// Service Worker for Portfolio Caching
const CACHE_NAME = 'portfolio-v1';
const STATIC_CACHE = 'portfolio-static-v1';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Determine which cache to use
          const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;

          caches.open(cacheName).then((cache) => {
            console.log('Caching new resource:', request.url);
            cache.put(request, responseToCache);
          });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Helper function to determine if an asset is static
function isStaticAsset(url) {
  return url.includes('/assets/') || 
         url.includes('/icons/') || 
         url.includes('.css') || 
         url.includes('.js') ||
         url.includes('.svg') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.webp');
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync analytics data when connection is restored
  console.log('Syncing analytics data...');
  // Implementation would go here
}`;

  fs.writeFileSync(path.join(__dirname, '../public/sw.js'), swContent);
  console.log('✅ Created service worker');
};

// 2. Create optimized Vite config
const updateViteConfig = () => {
  const viteConfigPath = path.join(__dirname, '../vite.config.ts');
  let config = fs.readFileSync(viteConfigPath, 'utf8');

  // Add performance optimizations
  const optimizations = `
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
              'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
              'ui-vendor': ['marked', 'react-hook-consent'],
              'ai-vendor': ['@google/genai']
            }
          }
        },
        chunkSizeWarningLimit: 1000,
        // Enable compression
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      // Enable preloading
      plugins: [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })
      ]`;

  // Replace the existing build config
  config = config.replace(
    /build: \{[^}]*\}/s,
    optimizations
  );

  fs.writeFileSync(viteConfigPath, config);
  console.log('✅ Updated Vite config with performance optimizations');
};

// 3. Create performance monitoring component
const createPerformanceMonitor = () => {
  const monitorContent = `// Performance Monitoring Component
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    bundleSize: 0
  });

  useEffect(() => {
    // Measure load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor FPS
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();

    // Monitor memory usage
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        setMetrics(prev => ({ ...prev, memoryUsage: usage }));
      }
    };
    
    const memoryInterval = setInterval(measureMemory, 5000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};

export default usePerformanceMonitor;`;

  fs.writeFileSync(path.join(__dirname, '../src/hooks/usePerformanceMonitor.ts'), monitorContent);
  console.log('✅ Created performance monitoring hook');
};

// 4. Create lazy loading utilities
const createLazyLoadingUtils = () => {
  const lazyUtilsContent = `// Lazy Loading Utilities
import { lazy, ComponentType } from 'react';

// Lazy load heavy components
export const LazyThreeBackground = lazy(() => import('../components/ThreeBackground'));
export const LazyFractalParticles = lazy(() => import('../components/FractalParticles'));
export const LazyVisitorTypeSelector = lazy(() => import('../components/VisitorTypeSelector'));
export const LazyTranslationTest = lazy(() => import('../components/TranslationTest'));

// Lazy load pages
export const LazyAbout = lazy(() => import('../pages/About'));
export const LazyProjects = lazy(() => import('../pages/Projects'));
export const LazyContact = lazy(() => import('../pages/Contact'));

// Conditional lazy loading for AI features
export const LazyAIFeatures = lazy(() => 
  import('../components/AIFeatures').catch(() => ({
    default: () => <div>AI features unavailable</div>
  }))
);

// Preload function for critical resources
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

// Preload critical chunks
export const preloadCriticalChunks = () => {
  preloadResource('/assets/react-vendor.js', 'script');
  preloadResource('/assets/index.css', 'style');
};

export default {
  LazyThreeBackground,
  LazyFractalParticles,
  LazyVisitorTypeSelector,
  LazyTranslationTest,
  LazyAbout,
  LazyProjects,
  LazyContact,
  LazyAIFeatures,
  preloadResource,
  preloadCriticalChunks
};`;

  fs.writeFileSync(path.join(__dirname, '../src/utils/lazyLoading.ts'), lazyUtilsContent);
  console.log('✅ Created lazy loading utilities');
};

// 5. Update package.json with performance scripts
const updatePackageScripts = () => {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    'build:analyze': 'npm run build && npx vite-bundle-analyzer dist',
    'build:prod': 'vite build --mode production',
    'perf:audit': 'lighthouse http://localhost:5177 --output html --output-path ./dist/lighthouse-report.html',
    'perf:monitor': 'node scripts/performance-monitor.js'
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with performance scripts');
};

// 6. Create performance monitoring script
const createPerformanceMonitorScript = () => {
  const monitorScript = `#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors website performance metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📊 Performance Monitoring Report\\n');

// Analyze bundle sizes
const distPath = path.join(__dirname, '../dist/assets');
const files = fs.readdirSync(distPath);

let totalSize = 0;
let gzipSize = 0;

console.log('📦 Bundle Analysis:');
console.log('==================');

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.css')) {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const gzip = Math.round(size * 0.3); // Approximate gzip ratio
    
    totalSize += size;
    gzipSize += gzip;
    
    console.log(\`\${file.padEnd(30)} \${(size / 1024).toFixed(2).padStart(8)} kB (gzip: \${gzip.toFixed(2)} kB)\`);
  }
});

console.log('\\n' + '='.repeat(50));
console.log(\`Total Bundle Size: \${(totalSize / 1024).toFixed(2)} kB\`);
console.log(\`Gzipped Size: \${(gzipSize / 1024).toFixed(2)} kB\`);

// Performance recommendations
console.log('\\n🎯 Performance Recommendations:');
console.log('================================');

if (totalSize > 1024 * 1024) {
  console.log('⚠️  Bundle size exceeds 1MB - consider code splitting');
}

if (gzipSize > 500 * 1024) {
  console.log('⚠️  Gzipped size exceeds 500kB - optimize further');
}

console.log('✅ Bundle analysis complete');
`;

  fs.writeFileSync(path.join(__dirname, '../scripts/performance-monitor.js'), monitorScript);
  console.log('✅ Created performance monitoring script');
};

// Execute all optimizations
const runOptimizations = () => {
  try {
    createServiceWorker();
    updateViteConfig();
    createPerformanceMonitor();
    createLazyLoadingUtils();
    updatePackageScripts();
    createPerformanceMonitorScript();
    
    console.log('\\n🎉 Performance optimization complete!');
    console.log('\\n📋 Next steps:');
    console.log('1. Run: npm run build:analyze');
    console.log('2. Test the service worker');
    console.log('3. Implement lazy loading in components');
    console.log('4. Monitor performance with: npm run perf:monitor');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
};

runOptimizations();
