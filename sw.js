/***
offline mode codes
________________
***/

/***
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
***/



/***
online mode codes 
_________________
***/


/****
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


const CACHE_NAME = 'my-pwa-cache-v1'; // जब भी बड़ा अपडेट करें, v1 से v2, v3 बदलें

// ऐप के लिए जरूरी फाइलों की लिस्ट (इन्हें ऑफलाइन के लिए स्टोर करना है)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // यदि आपकी कोई अलग CSS या JS फाइल है, तो उसका नाम भी यहाँ जोड़ें (जैसे: '/style.css')
];

// 1. इंस्टॉल इवेंट: सभी फाइलों को कैशे में सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('सभी जरूरी फाइलें ऑफलाइन के लिए सुरक्षित कर ली गई हैं');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // नए अपडेट को तुरंत तैयार करें
  );
});

// 2. एक्टिवेट इवेंट: पुराने कैशे को हटाना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('पुराना वर्जन हटाया जा रहा है...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. फेच इवेंट (Stale-While-Revalidate स्ट्रेटेजी): 
// यह ऐप को ऑफलाइन चलाएगा और इंटरनेट मिलने पर चुपचाप बैकग्राउंड में अपडेट डाउनलोड कर लेगा।
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // यदि कैशे में फाइल मौजूद है, तो तुरंत उसे दिखाएं (ताकि ऐप ऑफलाइन काम करे)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // बैकग्राउंड में सर्वर से नया डेटा लेकर कैशे को अपडेट करें
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // इंटरनेट न होने पर कोई एरर न आए
        console.log("आप अभी ऑफलाइन हैं");
      });

      return cachedResponse || fetchPromise;
    })
  );
});


