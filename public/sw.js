
const CACHE_NAME = 'khalil-portfolio-cache-v3.0'; // Updated for Liquid Glass theme
const ASSETS_TO_CACHE = [
  '/',
  './index.html',
  './index.css',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  // Certificates are important visual assets
  './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
  './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
  './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
  './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
  './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg'
];

// Install event: open cache and add core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ServiceWorker: Caching core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Force activation of new service worker
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
    }).then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event: Cache-first, then network strategy
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For external resources like Google Fonts or esm.sh, use a network-first or cache-first-with-revalidation strategy.
  // For this portfolio, we'll let them pass through to the network as the browser's HTTP cache handles them well.
  if (event.request.url.startsWith('https://fonts.googleapis.com') ||
      event.request.url.startsWith('https://fonts.gstatic.com') ||
      event.request.url.startsWith('https://esm.sh')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Return cached response if found, this is the "cache first" part.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network.
        return fetch(event.request).then(networkResponse => {
          // IMPORTANT: You should NOT cache opaque responses (from no-cors requests)
          // as you cannot check their status. Here we assume all local asset requests are fine.
          
          // Clone the response because a response is a stream and can only be consumed once.
          const responseToCache = networkResponse.clone();
          cache.put(event.request, responseToCache);
          
          return networkResponse;
        });
      });
    }).catch(error => {
      console.error('ServiceWorker: Error fetching data:', error);
      // Fallback for navigation requests (SPA support)
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    })
  );
});

// Optional: listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});