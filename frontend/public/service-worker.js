const CACHE_NAME = "chess-engine-cache";
const ASSETS_TO_CACHE = [
  "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.js",
  "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.wasm",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);
  
  if (requestURL.pathname.endsWith("/stockfish-16.1-lite.wasm")) {
    event.respondWith(
      caches.match(ASSETS_TO_CACHE[1])
        .then((response) => response || fetch(ASSETS_TO_CACHE[1]))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            return response;
          });
        })
    );
  }
});