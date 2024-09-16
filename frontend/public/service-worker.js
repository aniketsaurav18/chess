const CACHE_NAME = "chess-engine-cache";
const ASSETS_TO_CACHE = [
  "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.js",
  "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.wasm",
];

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);
  
  if (ASSETS_TO_CACHE.includes(requestURL.href)) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith((async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const fetchPromise = fetch(event.request);
      
      fetchPromise.then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
      });
      
      return fetchPromise;
    })());
  }
});