import Queue from "../utils/messageQueue";
import { useEffect, useState } from "react";
import EngineWrapper from "../utils/engineWrapper";
import { Chess, Square } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import { EngineDetails, CACHE_NAME } from "../utils/config";

const use_cdn_recource = import.meta.env.VITE_USE_CDN_RESOURCE === "true";

const useEngine = () => {
  //   const [engine, setEngine] = useState<Engine | null>(null);
  const [queue, _setQueue] = useState<Queue<string>>(new Queue());
  const [downloadProgress, setDownloadProgress] = useState({
    currentlyDownloading: "",
    progress: 0,
    size: 0,
  });
  const [worker, setWorker] = useState<Worker | null>(null);
  const [engineWrapper, setEngineWrapper] = useState<EngineWrapper | null>(
    null
  );
  const [engineConfiguration, setEngineConfiguration] = useState<any>({
    depth: 20,
    time: 5000, // engine will search for 5 seconds by default. time in ms
    threads: 1, // only applicable in multithreaded engine.
    multipv: 1, // number of lines to return
    elo: 0, // engine strength, 0 means no limit
  });
  const [game, _setGame] = useState(new Chess());
  const [boardState, setBoardState] = useState(game.fen());
  const [gameHistory, setGameHistory] = useState<any>([]);
  const [gameStatus, _setGameStatus] = useState<
    "STARTED" | "OVER" | "WAITING" | "IDEAL"
  >("STARTED");
  const [side, _setSide] = useState<BoardOrientation>("white");

  const makeMove = (sourceSquare: Square, targetSquare: Square) => {
    if (
      game.get(sourceSquare)?.color !== game.turn() ||
      game.turn() !== side[0] ||
      gameStatus !== "STARTED" ||
      worker == null
    )
      return false;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (!move) {
      return false;
    }
    setBoardState(game.fen());
    setGameHistory(game.history({ verbose: true }));
    console.log("game history", game.history({ verbose: true }));
    return true;
  };
  useEffect(() => {
    if (game.turn() === side[0]) {
      return;
    }
    const initiateEngineMove = async () => {
      console.log("initiating engine move");
      const move = await engineWrapper?.search(game.fen());
      console.log("move", move);

      let from = move?.slice(0, 2) as Square;
      let to = move?.slice(2, 4) as Square;
      console.log("from", from, "to", to);
      if (move) {
        const move = game.move({
          from: from,
          to: to,
          promotion: "q",
        });
        console.log("chess move", move);
        setBoardState(game.fen());
        setGameHistory(game.history({ verbose: true }));
      }
    };
    initiateEngineMove();
  }, [boardState]);

  const cacheStockfishJs = async (engine: (typeof EngineDetails)[0]) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedJSResponse = await cache.match(engine.public_js_path);
    const cachedWasmResponse = await cache.match(engine.public_wasm_path);
    if (cachedJSResponse && cachedWasmResponse) return;

    // Cache JS
    if (!cachedJSResponse) {
      const response = await fetch(
        use_cdn_recource ? engine.cdn_js_path : engine.public_js_path
      );

      const contentLength = response.headers.get("content-length");

      if (!response.body) {
        throw new Error("Unable to fetch Stockfish JS");
      }
      if (!contentLength) {
        throw new Error("Unable to track Stockfish JS size.");
      }

      const reader = response.body.getReader();
      const totalSize = parseInt(contentLength, 10);
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        console.log(`Received ${receivedLength} of ${totalSize} bytes`);
        setDownloadProgress({
          currentlyDownloading: engine.key,
          progress: (receivedLength / totalSize) * 100,
          size: totalSize,
        });
        chunks.push(value);
      }

      const blob = new Blob(chunks);

      const newResponse = new Response(blob, {
        headers: {
          "Content-Type": "application/javascript",
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
          "Content-Length": contentLength,
        },
      });
      await cache.put(engine.public_js_path, newResponse); //should always be public_js_path
    }

    // Cache WASM
    if (!cachedWasmResponse) {
      const response2 = await fetch(
        use_cdn_recource ? engine.cdn_wasm_path : engine.public_wasm_path
      );
      const contentLength2 = response2.headers.get("content-length");
      if (!response2.body) {
        throw new Error("Unable to fetch Stockfish WASM or track its size.");
      }
      if (!contentLength2) {
        throw new Error("Unable to track Stockfish WASM size.");
      }
      const reader2 = response2.body.getReader();
      const totalSize2 = parseInt(contentLength2, 10);
      let receivedLength2 = 0;
      const chunks2: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader2.read();
        if (done) break;
        receivedLength2 += value.length;
        console.log(`Received ${receivedLength2} of ${totalSize2} bytes`);
        setDownloadProgress({
          currentlyDownloading: engine.key,
          progress: (receivedLength2 / totalSize2) * 100,
          size: totalSize2,
        });
        chunks2.push(value);
      }
      const blob2 = new Blob(chunks2);
      const newResponse2 = new Response(blob2, {
        headers: {
          "Content-Type": "application/wasm",
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
          "Content-Length": contentLength2,
        },
      });
      await cache.put(engine.public_wasm_path, newResponse2);
    }
  };

  const initializeWorker = async (key: string) => {
    const SelectedEngineDetail = EngineDetails.find((i) => i.key === key);
    if (!SelectedEngineDetail) {
      throw new Error("Engine not found.");
    }
    if (typeof Worker !== "undefined") {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(
          SelectedEngineDetail.public_js_path
        );
        if (!cachedResponse) {
          await cacheStockfishJs(SelectedEngineDetail);
        }

        const stockfishWorker = new Worker(
          new URL(SelectedEngineDetail.public_js_path, import.meta.url)
        );
        setWorker(stockfishWorker);
        const engineWrapper = new EngineWrapper(stockfishWorker);
        setEngineWrapper(engineWrapper);
        console.log("initilise game", await engineWrapper.initializeGame());
        stockfishWorker.onerror = (event) => {
          console.error("Worker Error:", event.error);
        };

        stockfishWorker.postMessage("uci");

        return () => {
          if (worker) {
            worker.terminate();
          }
        };
      } catch (error) {
        console.error("Error initializing worker", error);
      }
    }
  };

  const sendCommand = async (command: string) => {
    if (engineWrapper) {
      engineWrapper.send(command);
      await engineWrapper.receiveUntil((line) => line == "");
    } else {
      console.error("Engine is not initialized.");
    }
  };

  return {
    worker,
    queue,
    downloadProgress,
    boardState,
    gameHistory,
    gameStatus,
    side,
    initializeWorker,
    sendCommand,
    makeMove,
  };
};

export default useEngine;
