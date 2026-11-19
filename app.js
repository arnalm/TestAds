// Keep the theme-color meta tag static in index.html for the earliest paint.
// This script only registers the service worker; it does not change the theme.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}
