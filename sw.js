self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // PWA इंस्टॉल करने के लिए यह इवेंट ज़रूरी है
});
