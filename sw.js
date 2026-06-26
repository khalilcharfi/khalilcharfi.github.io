const CACHE_NAME = 'khalil-portfolio-cache-v1.3'; // Increment version on updates
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  // Note: JS modules from esm.sh are typically cached by the browser's HTTP cache.
  // Explicitly caching them here can be complex due to dynamic URLs and versioning.
  // For a more robust offline experience with these, a build step that bundles them would be ideal.
  // We'll cache the main app shell and CSS.
  // Add paths to any local images or fonts you want to cache for offline use.
  // For example: '/images/profile.jpg', '/fonts/myfont.woff2'
  // Add placeholder icons to be cached (ensure these paths match your manifest.json and actual files)
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event: open cache and add core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ServiceWorker: Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('ServiceWorker: Failed to cache assets during install:', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('ServiceWorker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new SW takes control immediately
});

// Fetch event: serve cached content when offline, or fetch from network
self.addEventListener('fetch', event => {
  // We only want to handle GET requests for our assets
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy: Cache first, then network for assets defined in ASSETS_TO_CACHE
  // For other requests (like API calls, or dynamic esm.sh modules not in our list), go network first.
  const isAssetToCache = ASSETS_TO_CACHE.includes(new URL(event.request.url).pathname) || event.request.url === self.location.origin + '/';

  if (isAssetToCache) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            // Optionally, cache new assets on the fly if they are from your origin
            // For now, we rely on the install-time caching for core assets.
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('ServiceWorker: Error fetching data from cache or network:', error);
          // Fallback for HTML pages - crucial for SPA offline mode
          if (event.request.mode === 'navigate' || 
              (event.request.method === 'GET' && 
               event.request.headers.get('accept').includes('text/html'))) {
            return caches.match('/index.html');
          }
        })
    );
  } else {
    // For non-core assets (e.g., esm.sh modules, API calls), try network first, then cache (if available)
    // This is a common strategy for dynamic content or third-party resources.
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Optional: Cache successful responses from esm.sh or other CDNs if desired.
                // Be careful with caching opaque responses or large files.
                // if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' && event.request.url.startsWith('https://esm.sh/')) {
                //    const responseToCache = networkResponse.clone();
                //    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                // }
                return networkResponse;
            })
            .catch(() => {
                // If network fails, try to serve from cache if it exists
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If nothing is available, and it's a navigation request, serve offline page
                        if (event.request.mode === 'navigate' || 
                            (event.request.method === 'GET' && 
                             event.request.headers.get('accept').includes('text/html'))) {
                          return caches.match('/index.html');
                        }
                    });
            })
    );
  }
});

// Optional: listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});