const CACHE_NAME = 'weather-app-v2'; // Changed version to force update
const ASSETS = [
  '/',
  '/index.html',        // UPDATED: Was weather-app.html
  '/style.css',
  '/script.js',
  '/manifest.json'
  // Removed icons for now to stop 404 errors until you upload them
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Activate Event (Clean up old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});
