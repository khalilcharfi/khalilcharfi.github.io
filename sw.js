// Optimized Service Worker with proper caching strategies and update handling
const CACHE_VERSION = 'v5.0';
const CACHE_PREFIX = 'khalil-portfolio';

// Define cache names for different types of content
const CACHES = {
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  dynamic: `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  api: `${CACHE_PREFIX}-api-${CACHE_VERSION}`
};

// Critical assets to cache during installation (Cache-First strategy)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Profile and certificate assets (less critical, cached on demand)
const IMAGE_ASSETS = [
  '/asset/profile/profile-photo.jpg',
  '/asset/profile/profile-photo.jpeg',
  '/asset/profile/profile-photo-placeholder.svg'
];

// Maximum cache sizes to prevent storage bloat
const MAX_CACHE_SIZE = {
  dynamic: 50,
  images: 30,
  api: 20
};

// External domains to skip (CORS-restricted)
const SKIP_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'esm.sh',
  'media.licdn.com',
  'profile-images.xing.com',
  'xingassets.com'
];

// Helper: Check if URL is cacheable
function isCacheable(url) {
  try {
    const urlObj = new URL(url);
    
    // Skip non-HTTP(S) protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Skip external domains
    if (SKIP_DOMAINS.some(domain => url.includes(domain))) {
      return false;
    }
    
    // Skip chrome extensions
    if (url.includes('chrome-extension://') || 
        url.includes('moz-extension://') || 
        url.includes('edge-extension://')) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Helper: Limit cache size
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Delete oldest items (FIFO)
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

// Helper: Cache assets individually with error handling
async function cacheAssets(cache, assets) {
  const cachePromises = assets.map(asset => 
    cache.add(asset).catch(error => {
      console.warn(`[SW] Failed to cache ${asset}:`, error.message);
      return null;
    })
  );
  
  return Promise.all(cachePromises);
}

// INSTALL: Cache critical static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHES.static)
      .then(cache => {
        console.log('[SW] Caching static assets...');
        return cacheAssets(cache, STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation error:', error);
        // Don't fail installation
        return self.skipWaiting();
      })
  );
});

// ACTIVATE: Clean up old caches and claim clients
self.addEventListener('activate', event => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    // Clean up old caches
    caches.keys()
      .then(cacheNames => {
        const validCaches = Object.values(CACHES);
        
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!validCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activated successfully');
        // Take control of all clients immediately
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients about the update
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: CACHE_VERSION
            });
          });
        });
      })
  );
});

// FETCH: Implement smart caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip non-cacheable URLs
  if (!isCacheable(request.url)) {
    return;
  }
  
  const url = new URL(request.url);
  
  // Strategy 1: Cache-First for static assets (HTML, CSS, JS)
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(cacheFirstStrategy(request, CACHES.static));
  }
  
  // Strategy 2: Stale-While-Revalidate for images
  else if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidateStrategy(request, CACHES.images));
  }
  
  // Strategy 3: Network-First for API calls (same origin)
  else if (url.origin === self.location.origin) {
    event.respondWith(networkFirstStrategy(request, CACHES.dynamic));
  }
  
  // Default: Network-First with cache fallback
  else {
    event.respondWith(networkFirstStrategy(request, CACHES.dynamic));
  }
});

// Cache-First Strategy: Serve from cache, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache-First error:', error);
    
    // Fallback to cached index.html for navigation requests
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stale-While-Revalidate: Serve cached content, update cache in background
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Fetch fresh data in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
        // Limit cache size
        limitCacheSize(cacheName, MAX_CACHE_SIZE.images);
      }
      return response;
    })
    .catch(error => {
      console.warn('[SW] Background fetch failed:', error.message);
      return null;
    });
  
  // Return cached response immediately, or wait for network
  return cached || fetchPromise;
}

// Network-First: Try network, fallback to cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      
      // Limit cache size
      limitCacheSize(cacheName, MAX_CACHE_SIZE.dynamic);
    }
    
    return response;
  } catch (error) {
    console.warn('[SW] Network failed, trying cache:', request.url);
    
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Final fallback
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// MESSAGE: Handle messages from clients
self.addEventListener('message', event => {
  const { data } = event;
  
  if (!data) return;
  
  // Force skip waiting
  if (data.type === 'SKIP_WAITING') {
    console.log('[SW] Force updating...');
    self.skipWaiting();
  }
  
  // Clear all caches
  else if (data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches...');
    event.waitUntil(
      caches.keys().then(cacheNames => 
        Promise.all(cacheNames.map(name => caches.delete(name)))
      ).then(() => {
        console.log('[SW] All caches cleared');
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
  
  // Get cache info
  else if (data.type === 'GET_CACHE_INFO') {
    event.waitUntil(
      Promise.all([
        caches.keys(),
        ...Object.values(CACHES).map(async name => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, count: keys.length };
        })
      ]).then(([cacheNames, ...cacheInfo]) => {
        event.ports[0]?.postMessage({
          version: CACHE_VERSION,
          caches: cacheInfo,
          totalCaches: cacheNames.length
        });
      })
    );
  }
});

// PUSH: Handle push notifications (optional)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/asset/profile/profile-photo-placeholder.svg',
    badge: '/asset/profile/profile-photo-placeholder.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: crypto.randomUUID()
    },
    actions: [
      { action: 'open', title: 'Open', icon: '/asset/profile/profile-photo-placeholder.svg' },
      { action: 'close', title: 'Close', icon: '/asset/profile/profile-photo-placeholder.svg' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Khalil Charfi Portfolio', options)
  );
});

// NOTIFICATION CLICK: Handle notification interactions
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url === self.location.origin && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

console.log('[SW] Service Worker script loaded, version:', CACHE_VERSION);
