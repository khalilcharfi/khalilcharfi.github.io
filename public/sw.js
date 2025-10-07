
const CACHE_NAME = 'khalil-portfolio-cache-v4.2';
const ASSETS_TO_CACHE = [
  '/',
  './index.html',
  './manifest.json',
  './asset/profile/profile-photo.jpg',
  './asset/profile/profile-photo.jpeg',
  './asset/profile/profile-photo-placeholder.svg',
  './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
  './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
  './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
  './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
  './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Silent caching in production for better performance
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('ServiceWorker: Failed to cache assets during install:', error);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // Silent cache cleanup in production
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  if (event.request.url.startsWith('https://fonts.googleapis.com') ||
      event.request.url.startsWith('https://fonts.gstatic.com') ||
      event.request.url.startsWith('https://esm.sh') ||
      event.request.url.includes('media.licdn.com') ||
      event.request.url.includes('profile-images.xing.com') ||
      event.request.url.includes('xingassets.com')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(networkResponse => {
          const responseToCache = networkResponse.clone();
          cache.put(event.request, responseToCache);
          
          return networkResponse;
        });
      });
    }).catch(error => {
      console.error('ServiceWorker: Error fetching data:', error);
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

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});