const CACHE_NAME = 'kuis-jepang-v2';
const urlsToCache = [
  '/Kosakata-Jepang-/',
  '/Kosakata-Jepang-/index.html',
  '/Kosakata-Jepang-/manifest.json',
  '/Kosakata-Jepang-/icon-192.png',
  '/Kosakata-Jepang-/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => caches.match('/Kosakata-Jepang-/index.html'))
  );
});
