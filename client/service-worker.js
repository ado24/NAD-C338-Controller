// service-worker.js
const CACHE_NAME = 'media-app-cache-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/client/bluos-client.js',
    '/js/client/nad-client.js',
    '/js/model/interface/AudioPlayer.js',
    '/js/model/interface/IAudioPlayer.js',
    '/js/model/BluOSPlayer.js',
    '/js/model/NAD_C338.js',
    '/js/workers/timerWorker.js',
    '/images/nad-logo.png',
    '/images/mqa-logo.png',
    '/images/favicon.ico',
    '/manifest.json'
];

// Install service worker and cache assets.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.error(`Failed to cache: ${url}`, error);
                            return null;
                        });
                    })
                );
            })
    );
});

// Activate service worker and clean up old caches.
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clear old caches
            caches.keys().then(keys => Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )),
            // Optional: claim clients immediately
            self.clients.claim()
        ])
    );
});

// Fetch cached content when offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
        .catch(() => {
            return caches.match('/index.html');
        })
  );
});

// Update service worker.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      })
    ))
  );
});


// Refresh cache periodically (e.g., every 24 hours)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'refresh-cache') {
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(error => {
                            console.error(`Failed to refresh cache for: ${url}`, error);
                        });
                    })
                );
            })
        );
    }
});

// Request periodic sync registration
self.addEventListener('activate', event => {
    event.waitUntil(
        self.registration.periodicSync.register('refresh-cache', {
            minInterval: 24 * 60 * 60 * 1000 // 24 hours
        }).catch(error => {
            console.error('Periodic sync registration failed:', error);
        })
    );
});

// Listen for messages from the client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('Cache cleared');
        });
    }
});