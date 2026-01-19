// 1. We changed 'v2' to 'v3'. This forces the browser to reset.
const CACHE_NAME = 'weather-app-v3'; 

const ASSETS = [
  '/',
  '/index.html',  // Correct name (was weather-app.html)
  '/style.css',
  '/script.js',
  '/manifest.json'
  // NOTE: We removed 'icon-192.png' from here so it stops looking for it
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // NEW: This forces the new worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Activate Event (Deletes old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
