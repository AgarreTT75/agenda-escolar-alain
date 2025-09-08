// sw.js (v3)
const CACHE_NAME = 'agenda-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Estrategia "network-first" para index y misma origen, con fallback a caché
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(req, { cache: 'no-store' });
          // Actualiza caché en segundo plano
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, network.clone());
          return network;
        } catch (_) {
          const cached = await caches.match(req);
          return cached || caches.match('./index.html');
        }
      })()
    );
  }
});
