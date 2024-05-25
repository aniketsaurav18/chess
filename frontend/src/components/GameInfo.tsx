import { useEffect, useState } from "react";
import "./GameInfo.css";
import MoveHistory from "./MoveHistory";
import { DRAW_ACCEPTED, DRAW_DECLINED, RESIGN } from "../utils/messages";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

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
  side: BoardOrientation;
  waiting: boolean;
  status: "STARTED" | "OVER" | "WAITING" | "IDEAL";
  socket: WebSocket | null;
  startGame: () => void;
  gameHistory: Move[];
  drawOffered: boolean;
  setDrawOffered: (val: boolean) => void;
  offerDrawfn: () => void;
  offerDraw: boolean;
}

const GameInfo = ({
  side,
  waiting,
  status,
  socket,
  startGame,
  gameHistory,
  drawOffered,
  setDrawOffered,
  offerDrawfn,
  offerDraw,
}: GameInfoProps) => {
  const [moveHistory, setMoveHistory] = useState<Move[][]>([]);

  useEffect(() => {
    console.log(drawOffered);
  }, [drawOffered]);

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

  const resignFn = () => {
    if (status !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: RESIGN, d: { color: side[0] } }));
  };

  const drawAccepted = () => {
    if (status !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_ACCEPTED, d: { color: side[0] } }));
    setDrawOffered(false);
  };

  const drawDeclined = () => {
    if (status !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_DECLINED, d: { color: side[0] } }));
    setDrawOffered(false);
  };

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
        {drawOffered ? (
          <div className="draw-offered-dialogue">
            <span>Oponent offered a Draw</span>
            <button className="draw-offered-btn" onClick={drawAccepted}>
              Accept
            </button>
            <button className="draw-offered-btn" onClick={drawDeclined}>
              Decline
            </button>
          </div>
        ) : null}
      </div>
      <div className="user-control">
        <button className="btn-resign" onClick={resignFn}>
          Resign
        </button>
        <button
          className="btn-draw"
          onClick={offerDrawfn}
          style={offerDraw ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          disabled={offerDraw}
        >
          Draw
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
