const CACHE_NAME = 'online-pwa-v1';
const OFFLINE_URL = '/offline.html';

// इंस्टॉल होने पर सिर्फ offline.html को सेव करें
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// पुराने कैश को साफ करें
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// हर पेज को सीधे ऑनलाइन लोड करें, इंटरनेट न होने पर offline.html दिखाएं
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
