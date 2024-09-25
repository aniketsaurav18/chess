const CACHE_NAME = "chess-engine-cache";

const ASSETS_TO_CACHE = [
  "/engine/stockfish-16.1.js",
  "/engine/stockfish-16.1.wasm",
  "/engine/stockfish-16.1-lite.js",
  "/engine/stockfish-16.1-lite.wasm",
  "/engine/stockfish-16.1-lite-single.js",
  "/engine/stockfish-16.1-lite-single.wasm",
  "/engine/stockfish-16.1-asm.js",
  "/engine/stockfish-16.1-single.js",
  "/engine/stockfish-16.1-single.wasm",
];

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);
  
  if (ASSETS_TO_CACHE.includes(requestURL.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Clone the cached response to modify headers
          const modifiedResponse = new Response(cachedResponse.body, {
            headers: {
              "Content-Type": cachedResponse.headers.get("Content-Type") || "application/octet-stream",
              "Cross-Origin-Embedder-Policy": "require-corp",
              "Cross-Origin-Opener-Policy": "same-origin",
            },
          });
          return modifiedResponse; 
        } else {
          return fetch(event.request); 
        }
      })
    );
  } else {
    event.respondWith(fetch(event.request)); 
  }
});
