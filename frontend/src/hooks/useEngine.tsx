import Queue from "../utils/messageQueue";
import { useEffect, useState } from "react";
import EngineWrapper from "../utils/engineWrapper";
import { Chess, Square } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

const CACHE_NAME = "chess-engine-cache";
const STOCKFISH_JS_URL =
  "https://chess-engine.s3.ap-south-1.amazonaws.com/stockfish-16.1-lite.js";
const CACHED_JS_URL = "/stockfish-16.1-lite.js";

const useEngine = () => {
  //   const [engine, setEngine] = useState<Engine | null>(null);
  const [queue, _setQueue] = useState<Queue<string>>(new Queue());
  const [progress, setProgress] = useState(0);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [engineWrapper, setEngineWrapper] = useState<EngineWrapper | null>(
    null
  );
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
      gameStatus !== "STARTED"
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
  const cacheStockfishJs = async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(CACHED_JS_URL);
    if (cachedResponse) return;

    const response = await fetch(STOCKFISH_JS_URL);

    const contentLength = response.headers.get("content-length");

    if (!response.body || !contentLength) {
      throw new Error("Unable to fetch Stockfish JS or track its size.");
    }

    const reader = response.body.getReader();
    const totalSize = parseInt(contentLength, 10);
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedLength += value.length;
      setProgress((receivedLength / totalSize) * 100);
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

    await cache.put(CACHED_JS_URL, newResponse);
  };

  const initializeWorker = async () => {
    if (typeof Worker !== "undefined") {
      try {
        await cacheStockfishJs();

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(CACHED_JS_URL);

        if (cachedResponse) {
          const stockfishWorker = new Worker(
            new URL(CACHED_JS_URL, import.meta.url)
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
        }
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
    progress,
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
