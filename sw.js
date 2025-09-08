self.addEventListener('install', e => {
  e.waitUntil(caches.open('agenda-v1').then(c => c.addAll([
    './','./index.html','./manifest.json','./assets/icon-192.png','./assets/icon-512.png','./assets/favicon.png'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});