const staticSupermarketInquiry = "";
const assets = [
  "/",
  "/index.html",
  "/css/index.css",
  "/js/index.js",
  "/js/navBar.js",
  "/serverDefaultedImages/title.jpg",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticSupermarketInquiry).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
