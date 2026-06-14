// Auto-increment version: updated on each deploy
const CACHE_VERSION = '20260614-001'; // Format: YYYYMMDD-NNN
const CACHE_NAME = `studiehub-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/app.css',
  '/assets/app.js',
  '/content.json',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // Immediately activate the new Service Worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => !name.includes(CACHE_VERSION))
          .map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Immediately claim all clients
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network-first for external/third-party resources
  const isExternal = event.request.url.includes('youtube') ||
                     event.request.url.includes('youtu.be') ||
                     event.request.url.includes('cdn') ||
                     !event.request.url.includes(self.location.origin);

  if (isExternal) {
    return event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }

  // Stale-while-revalidate for content.json (always up-to-date)
  if (event.request.url.endsWith('content.json')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            // Notify all clients of update
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: 'CONTENT_UPDATED' });
              });
            });
          }
          return response;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Cache-first for app assets
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
