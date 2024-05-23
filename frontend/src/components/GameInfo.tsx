import { useEffect, useState } from "react";
import "./GameInfo.css";
import MoveHistory from "./MoveHistory";

interface Move {
  from: string;
  to: string;
  color: string;
  piece: string;
  san: string;
  flags: string;
  lan: string;
  before: string;
  after: string;
  captured?: string;
  time: number;
}

interface GameInfoProps {
  waiting: boolean;
  status: "STARTED" | "OVER" | "WAITING" | "IDEAL";
  socket: WebSocket | null;
  startGame: () => void;
  gameHistory: Move[];
}

const GameInfo = ({
  waiting,
  status,
  socket,
  startGame,
  gameHistory,
}: GameInfoProps) => {
  const [moveHistory, setMoveHistory] = useState<Move[][]>([]);

  useEffect(() => {
    if (gameHistory.length === 0) return;
    console.log(gameHistory);
    // console.log(gameHistory[0].after);
    // console.log(gameHistory[0].before);

    const history: Move[][] = [[]];
    for (let i = 0; i < gameHistory.length; i++) {
      if (i % 2 === 0) {
        if (history[history.length - 1].length === 2) {
          history.push([gameHistory[i]]);
        } else {
          history[history.length - 1].push(gameHistory[i]);
        }
      } else {
        history[history.length - 1].push(gameHistory[i]);
      }
    }
    setMoveHistory(history);
  }, [gameHistory]);

  return (
    <div className="game-detail-interface">
      <div className="detail-interface-top">
        <div className="game-status">
          {waiting ? "waiting..." : ""}
          {status ? status : ""}
          {socket ? "socket connected" : "socket not connected"}
        </div>
        <button className="rc-button" onClick={startGame}>
          start
        </button>
      </div>
      <div className="game-history">
        <div className="game-history-top">History</div>
        <MoveHistory moveHistory={moveHistory} />
      </div>
    </div>
  );
};

export default GameInfo;
