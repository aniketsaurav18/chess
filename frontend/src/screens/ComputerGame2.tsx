import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";

const ComputerPlay2 = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [command, setCommand] = useState("");

  useEffect(() => {
    // Check for Web Worker support
    if (typeof Worker !== "undefined") {
      console.log("Web Workers are supported in this browser.");

      // Check for multi-threading capability
      const cores = navigator.hardwareConcurrency || 1; // Default to 1 if undefined
      console.log(`Number of logical processors available: ${cores}`);

      // Initialize the Stockfish Web Worker
      const stockfishWorker = new Worker(
        new URL("../engine/stockfish-16.1-single.js", import.meta.url)
      );

      if (stockfishWorker) {
        // Set number of threads for Stockfish
        stockfishWorker.postMessage("setoption name Threads value 5");
      }
      setWorker(stockfishWorker);

      stockfishWorker.onmessage = (event) => {
        console.log(event.data);
      };
      stockfishWorker.onerror = (event) => {
        console.error(event.error);
      };
      stockfishWorker.onmessageerror = (event) => {
        console.error("Message error:", event.data);
      };

      return () => {
        stockfishWorker.terminate(); // Clean up the worker on component unmount
      };
    } else {
      console.error("Web Workers are not supported in this browser.");
    }
  }, []);

  const handleSend = () => {
    if (worker) {
      console.log("command", command);
      worker.postMessage(command);
    } else {
      console.error("Worker is not initialized.");
    }
  };

  return (
    <>
      <Chessboard boardWidth={500} />
      <input value={command} onChange={(e) => setCommand(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </>
  );
};

export default ComputerPlay2;
