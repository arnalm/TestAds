
const CACHE_NAME = "my-fullscreen-pwa-v2";

const FILES = [
  "./",
  "./app.html",
  "./manifest.json",
  "./index.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );

  self.skipWaiting();

});

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

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then(response => {

        if (response.ok) {

          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

        }

        return response;

      })
      .catch(async () => {

        const cached = await caches.match(event.request);

        if (cached) return cached;

        return new Response("Offline page unavailable", {
          status: 503
        });

      })

  );

});
