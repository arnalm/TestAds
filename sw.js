const CACHE_NAME = 'online-only-v1';
const OFFLINE_URL = '/offline.html';

// 1. इंस्टॉल होने पर सिर्फ ऑफ़लाइन अलर्ट पेज को सेव करें
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// 2. हर रिक्वेस्ट को सीधे इंटरनेट (Network) से लोड करें
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // इंटरनेट न होने पर offline.html दिखाएं
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
