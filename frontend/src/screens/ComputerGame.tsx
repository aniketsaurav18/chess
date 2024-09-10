import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { openDB } from "idb"; // Import the idb library

const DB_NAME = "nnueCache";
const STORE_NAME = "files";

const ComputerPlay = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [command, setCommand] = useState("");

  useEffect(() => {
    // Initialize the IndexedDB and fetch the NNUE file
    const initializeAndCacheNNUE = async () => {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        },
      });

      // Check if NNUE file is already in the cache
      let nnueData = await db.get(STORE_NAME, "nnueFile");

      if (!nnueData) {
        try {
          // Fetch the NNUE file from the server
          const response = await fetch("/nn-b1a57edbea57.nnue"); // Adjust the path as needed
          if (!response.ok) {
            throw new Error("Failed to fetch NNUE file");
          }
          nnueData = await response.blob(); // Convert the response to a Blob

          // Store the NNUE file in IndexedDB
          await db.put(STORE_NAME, nnueData, "nnueFile");
          console.log("NNUE file cached in IndexedDB");
        } catch (error) {
          console.error("Error fetching NNUE file:", error);
          return;
        }
      } else {
        console.log("NNUE file loaded from IndexedDB");
      }

      // Create a Blob URL from the NNUE data
      const nnueBlobUrl = URL.createObjectURL(nnueData);

      // Initialize the Web Worker
      const stockfishWorker = new Worker(
        new URL("../engine/sf161-70.js", import.meta.url),
        {
          /* @vite-ignore */
          type: "module",
        }
      );

      // Handle messages from Stockfish
      stockfishWorker.onmessage = (event) => {
        console.log(event.data);
      };

      // Load the NNUE file using the Blob URL
      stockfishWorker.postMessage(
        `setoption name EvalFile value ${nnueBlobUrl}`
      );

      setWorker(stockfishWorker);

      // Cleanup the worker and Blob URL when the component unmounts
      return () => {
        stockfishWorker.terminate();
        URL.revokeObjectURL(nnueBlobUrl); // Clean up Blob URL
      };
    };

    initializeAndCacheNNUE();
  }, []);

  const handleSend = () => {
    if (worker) {
      console.log(command);
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

export default ComputerPlay;
