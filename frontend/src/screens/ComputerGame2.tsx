import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import useEngine from "../hooks/useEngine";

const ComputerPlay2 = () => {
  const [command, setCommand] = useState("");
  const {
    worker,
    progress,
    gameStatus,
    gameHistory,
    side,
    boardState,
    initializeWorker,
    sendCommand,
    makeMove,
  } = useEngine();

  const handleSend = () => {
    if (worker) {
      sendCommand(command);
    } else {
      console.error("Worker is not initialized.");
    }
  };

  const handleLoadWorker = async () => {
    await initializeWorker("stockfish");
  };

  return (
    <>
      <Chessboard
        boardWidth={500}
        position={boardState}
        onPieceDrop={makeMove}
        boardOrientation={side}
        areArrowsAllowed={true}
        arePremovesAllowed={true}
      />
      <input value={command} onChange={(e) => setCommand(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      <button onClick={handleLoadWorker}>Load Worker</button>
      <div>Loading Stockfish JS: {progress.toFixed(2)}%</div>
    </>
  );
};

export default ComputerPlay2;
