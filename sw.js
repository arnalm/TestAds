const CACHE_NAME = "my-fullscreen-pwa-v3";

const FILES = [
  "./",
  "./app.html",
  "./manifest.json",
  "./index.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
// Install Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First Strategy (Isse internet on hone par bhi fast aur bina border load hoga)
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Agar cache mein file mil gayi, toh pehle wahi de do (Fast & No Border)
      if (cachedResponse) {
        // Background mein network se update bhi kar lo taaki nayi file rahe
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // Agar cache mein nahi hai, toh network se lao
      return fetch(event.request).then(response => {
        if (!response || !response.ok) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(() => {
        return new Response("Offline page unavailable", { status: 503 });
      });
    })
  );
});
