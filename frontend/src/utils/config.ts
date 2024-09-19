export const viewportWidthBreakpoint = 1024;

export const GameTimeLimit = [
  { key: "2", label: "2 Minutes" },
  { key: "5", label: "5 Minutes" },
  { key: "10", label: "10 Minutes" },
  { key: "15", label: "15 Minutes" },
];

export const EngineDetails = [
  {
    key: "stockfish-16.1",
    label: "Stockfish 16.1 Multi-threaded",
    public_path: "/engine/stockfish-16.1.js",
    cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1.js",
    wasm_cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1.wasm",
    multiThreaded: true,
  },
  {
    key: "stockfish-16.1-single",
    label: "Stockfish 16.1 Single-threaded",
    public_path: "/engine/stockfish-16.1-single.js",
    cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-single.js",
    wasm_cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-single.wasm",
    multiThreaded: false,
  },
  {
    key: "stockfish-16.1-lite",
    label: "Stockfish 16.1 Lite Multi-threaded",
    public_path: "/engine/stockfish-16.1-lite.js",
    cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.js",
    wasm_cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.wasm",
    multiThreaded: true,
  },
  {
    key: "stockfish-16.1-lite-single",
    label: "Stockfish 16.1 Lite Single-threaded",
    public_path: "/engine/stockfish-16.1-lite-single.js",
    cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite-single.js",
    wasm_cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite-single.wasm",
    multiThreaded: false,
  },
  {
    key: "stockfish-16.1-asm",
    label: "Stockfish JS (Light Weight)",
    public_path: "/engine/stockfish-16.1-asm.js",
    cdn_path:
      "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-asm.js",
    wasm_cdn_path: "", // No WASM for this engine
    multiThreaded: false,
  },
];
