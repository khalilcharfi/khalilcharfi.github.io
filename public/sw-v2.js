
// Ultra-simple Service Worker with maximum compatibility
const CACHE_VERSION = 'v8';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// Helper function to safely check if URL can be cached
function isCacheableUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Install event - robust cache setup
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v8...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        
        // Define files to cache with individual error handling
        const filesToCache = [
          '/',
          '/index.html',
          '/manifest.json',
          '/asset/profile-photo.jpg',
          '/asset/profile-photo.jpeg'
        ];
        
        // Cache files individually to handle failures gracefully
        const cachePromises = filesToCache.map(file => {
          return cache.add(file).catch(error => {
            console.warn(`Service Worker: Failed to cache ${file}:`, error);
            return null; // Continue with other files even if one fails
          });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Install error:', error);
        // Don't fail the installation even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v7...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - ultra-safe strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Completely ignore problematic URL schemes
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    console.log('Service Worker: Ignoring non-HTTP request:', request.url);
    return;
  }

  // Ignore chrome-extension URLs completely
  if (request.url.includes('chrome-extension://') || 
      request.url.includes('moz-extension://') || 
      request.url.includes('edge-extension://')) {
    console.log('Service Worker: Ignoring extension request:', request.url);
    return;
  }

  // For all other requests, use network-first with safe caching
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses for same-origin requests
        if (response.ok && url.origin === self.location.origin) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            })
            .catch((error) => {
              console.warn('Service Worker: Failed to cache response:', error);
            });
        }
        return response;
      })
      .catch((error) => {
        console.log('Service Worker: Network failed, trying cache:', request.url);
        return caches.match(request);
      })
  );
});

// Simple message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('Service Worker: Clearing all caches...');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Simple push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New portfolio update available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});