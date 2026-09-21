const CACHE_NAME = "preisscan-v0.2.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/styles.css",
  "./js/data.js",
  "./js/app.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isRemoteAsset = url.origin !== self.location.origin && event.request.destination === "image";

  if(isRemoteAsset){
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if(cached) return cached;
        try{
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        }catch{
          return new Response("", {status:404});
        }
      })
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
