import Queue from "../lib/messageQueue";
import { useEffect, useState } from "react";
import EngineWrapper from "../lib/engineWrapper";
import { Chess, Square } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import {
  EngineDetails,
  CACHE_NAME,
  DEFAULT_ENGINE_CONFIG,
} from "../utils/config";
import { Move } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateStatus } from "../store/slices/engine/engineStatus";

const use_cdn_recource = import.meta.env.VITE_USE_CDN_RESOURCE === "true";

const useEngine = () => {
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
  const engineStatus = useAppSelector((state) => state.engine.status);
  const dispatch = useAppDispatch();
  const [engineConfiguration, setEngineConfiguration] = useState<any>({
    ...DEFAULT_ENGINE_CONFIG,
  });
  const [game, _setGame] = useState(new Chess());
  const [boardState, setBoardState] = useState(game.fen());
  const [gameHistory, setGameHistory] = useState<Move[]>([]);
  const [gameStatus, setGameStatus] = useState<
    "STARTED" | "OVER" | "WAITING" | "IDEAL"
  >("IDEAL");
  const [side, setSide] = useState<BoardOrientation>("white");

  useEffect(() => {
    if (!engineWrapper) return;
    if (side === "white") {
      engineWrapper.side = "white";
    } else {
      engineWrapper.side = "black";
    }
  }, [side]);

  useEffect(() => {
    if (
      game.in_checkmate() ||
      game.in_draw() ||
      game.in_stalemate() ||
      game.in_threefold_repetition() ||
      game.insufficient_material()
    ) {
      setGameStatus("OVER");
      return;
    }
    if (!engineStatus) {
      return;
    }
    if (
      (side === "black" && game.turn() === "w") ||
      (side === "white" && game.turn() === "b")
    ) {
      initiateEngineMove(game.fen());
    }
  }, [engineStatus, side, boardState]);

  const initiateEngineMove = async (fen: string) => {
    console.log("initiating engine move");
    if (engineWrapper === null) {
      console.error("Engine not initialized");
      return;
    }
    const move = await engineWrapper.search(fen);
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
      updateHistory(move);
    }
  };

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
    updateHistory(move);
    console.log("game history", game.history({ verbose: true }));
    return true;
  };
  const updateHistory = (move: any) => {
    setGameHistory((history: any) => {
      return [...history, move];
    });
  };

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

      if (!response.body) {
        throw new Error("Unable to fetch Stockfish JS");
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      const contentLength = response.headers.get("content-length");
      const totalSize = contentLength
        ? parseInt(contentLength, 10)
        : engine.jssize;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedLength += value.length;
        console.log(
          `Received ${receivedLength} bytes` +
            (totalSize ? ` of ${totalSize} bytes` : "")
        );
        setDownloadProgress({
          currentlyDownloading: engine.key,
          progress: totalSize ? (receivedLength / totalSize) * 100 : -1, // Use -1 for unknown progress
          size: totalSize !== undefined ? totalSize : -1, // Use -1 for unknown size
        });
        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const newResponse = new Response(blob, {
        headers: {
          "Content-Type": "application/javascript",
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
        },
      });
      await cache.put(engine.public_js_path, newResponse);
    }

    // Cache WASM
    if (!cachedWasmResponse) {
      const response2 = await fetch(
        use_cdn_recource ? engine.cdn_wasm_path : engine.public_wasm_path
      );

      if (!response2.body) {
        throw new Error("Unable to fetch Stockfish WASM");
      }

      const reader2 = response2.body.getReader();
      const chunks2: Uint8Array[] = [];
      let receivedLength2 = 0;
      const contentLength2 = response2.headers.get("content-length");
      const totalSize2 = contentLength2
        ? parseInt(contentLength2, 10)
        : engine.wasmsize;

      while (true) {
        const { done, value } = await reader2.read();
        if (done) break;

        receivedLength2 += value.length;
        console.log(
          `Received ${receivedLength2} bytes` +
            (totalSize2 ? ` of ${totalSize2} bytes` : "")
        );
        setDownloadProgress({
          currentlyDownloading: engine.key,
          progress: totalSize2 ? (receivedLength2 / totalSize2) * 100 : -1, // Use -1 for unknown progress
          size: totalSize2 !== undefined ? totalSize2 : -1, // Use -1 for unknown size
        });
        chunks2.push(value);
      }

      const blob2 = new Blob(chunks2);
      const newResponse2 = new Response(blob2, {
        headers: {
          "Content-Type": "application/wasm",
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
        },
      });
      await cache.put(engine.public_wasm_path, newResponse2);
    }

    setDownloadProgress({
      currentlyDownloading: "",
      progress: 0,
      size: 0,
    });
  };

  const initializeWorker = async (
    key: string,
    config: Record<string, string> = {}
  ) => {
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
        console.log("config", config);
        const initialized = await engineWrapper.initialize({
          Threads: `${SelectedEngineDetail.multiThreaded ? config.threads : 1}`,
          MultiPV: config.multipv,
          Time: config.time,
          Depth: config.depth,
        });

        stockfishWorker.onerror = (event) => {
          console.error("Worker Error:", event.error);
        };
        if (initialized) {
          console.log("Engine Initialized");
          dispatch(updateStatus("ready"));
          setGameStatus("STARTED");
        }

        return () => {
          if (worker) {
            worker.terminate();
          }
        };
      } catch (error) {
        console.error("Error initializing worker", error);
        throw new Error("Error initializing worker");
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
    setSide,
    engineConfiguration,
    initializeWorker,
    sendCommand,
    makeMove,
    setEngineConfiguration,
  };
};

export default useEngine;
