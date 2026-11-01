/***
offline mode codes
________________
***/


const CACHE_NAME = 'pwa-android-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker and cache core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch assets from cache or network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});



/***
online mode codes 
_________________
***/

/***

const CACHE_NAME = 'my-site-cache-v2'; // हर बड़े अपडेट पर v2, v3 बदलते रहें

// नए सर्विस वर्कर को तुरंत एक्टिवेट करने के लिए
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('पुराना कैशे हटाया जा रहा है...');
                        return caches.delete(cache); // पुराना डेटा डिलीट करें
                    }
                })
            );
        }).then(() => self.clients.claim()) // तुरंत नया कंट्रोल लें
    );
});

// नेटवर्क से हमेशा नया डेटा लेने का प्रयास करें
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
***/

