const CACHE_NAME = "techpods-mtr-v1";
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/config/app.js",
  "/js/config/supabase.js",
  "/js/services/supabaseClient.js",
  "/js/services/productsService.js",
  "/js/services/authService.js",
  "/js/utils/dom.js",
  "/js/utils/formatters.js",
  "/js/utils/sanitize.js",
  "/js/utils/validators.js",
  "/js/components/header.js",
  "/js/components/productCard.js",
  "/assets/icons/icon-192.svg",
  "/assets/icons/icon-512.svg",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/images/techpods-logo-cropped.jpeg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match("/offline.html");
          return cached;
        });

      return cached || network;
    })
  );
});
