export const viewportWidthBreakpoint = 1024;

export const GameTimeLimit = [
  { key: "2", label: "2 Minutes" },
  { key: "5", label: "5 Minutes" },
  { key: "10", label: "10 Minutes" },
  { key: "15", label: "15 Minutes" },
];

export const CACHE_NAME = "chess-engine-cache";

export const DEFAULT_ENGINE_CONFIG = {
  key: "stockfish-16.1-lite", // key of default engine. (Refer EngineDetails)
  depth: 20, // engine will search for 20 moves by default
  time: 8000, // engine will search for 8 seconds by default. time in ms
  threads: 1, // only applicable in multithreaded engine.
  multipv: 1, // number of lines to return
  elo: 0, // engine strength, 0 means no limit
};

export const EngineDetails = [
  {
    key: "stockfish-16.1",
    label: "Stockfish 16.1 Multi-threaded",
    public_js_path: "/engine/stockfish-16.1.js",
    public_wasm_path: "/engine/stockfish-16.1.wasm",
    cdn_js_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1.js",
    cdn_wasm_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1.wasm",
    multiThreaded: true,
  },
  {
    key: "stockfish-16.1-single",
    label: "Stockfish 16.1 Single-threaded",
    public_js_path: "/engine/stockfish-16.1-single.js",
    public_wasm_path: "/engine/stockfish-16.1-single.wasm",
    cdn_js_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-single.js",
    cdn_wasm_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-single.wasm",
    multiThreaded: false,
  },
  {
    key: "stockfish-16.1-lite",
    label: "Stockfish 16.1 Lite Multi-threaded",
    public_js_path: "/engine/stockfish-16.1-lite.js",
    public_wasm_path: "/engine/stockfish-16.1-lite.wasm",
    cdn_js_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.js",
    cdn_wasm_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.wasm",
    multiThreaded: true,
  },
  {
    key: "stockfish-16.1-lite-single",
    label: "Stockfish 16.1 Lite Single-threaded",
    public_js_path: "/engine/stockfish-16.1-lite-single.js",
    public_wasm_path: "/engine/stockfish-16.1-lite-single.wasm",
    cdn_js_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite-single.js",
    cdn_wasm_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite-single.wasm",
    multiThreaded: false,
  },
  {
    key: "stockfish-16.1-asm",
    label: "Stockfish JS (Light Weight)",
    public_js_path: "/engine/stockfish-16.1-asm.js",
    public_wasm_path: "", // No WASM for this engine
    cdn_js_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-asm.js",
    cdn_wasm_path: "", // No WASM for this engine
    multiThreaded: false,
  },
];
