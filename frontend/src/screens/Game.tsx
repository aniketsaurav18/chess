import { useEffect, useRef, useState } from "react";
import { Chess, Square } from "chess.js";

import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const OPPONENT_DISCONNECTED = "opponent_disconnected";
export const GAME_OVER = "game_over";
export const JOIN_ROOM = "join_room";
export const GAME_JOINED = "game_joined";
export const GAME_ALERT = "game_alert";
export const GAME_ADDED = "game_added";
export const USER_TIMEOUT = "user_timeout";
export const GAME_TIME = "game_time";

interface GameProp {
  boardWidth: number;
}

const WS_URL = import.meta.env.VITE_APP_WS_URL ?? "ws://localhost:8080";

export function Game({ boardWidth }: GameProp) {
  const chessboardRef = useRef<any>();
  const [game, setGame] = useState(new Chess());
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [started, setStarted] = useState(false);
  // const [gameMetadata, setGameMetadata] = useState<Metadata|null>(null);
  const [side, setSide] = useState<BoardOrientation>("white");

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  });
  const startGame = () => {
    if (!socket) {
      return null;
    }
    try {
      socket.send("init_game");
      return true;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setSide(message.payload.color);
          setStarted(true);
          break;
        case MOVE:
          makeMove(message.payload.move.from, message.payload.move.to);
          break;
      }
    };
  }, [socket]);

  function safeGameMutate(modify: any) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const makeMove = (sourceSquare: Square, targetSquare: Square) => {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    if (!move) {
      return false;
    }
    setGame(gameCopy);
    return true;
  };

  return (
    <div>
      <Chessboard
        id="PlayVsPlay"
        animationDuration={200}
        boardWidth={boardWidth}
        position={game.fen()}
        onPieceDrop={makeMove}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
        ref={chessboardRef}
        boardOrientation={side}
      />
      <button
        className="rc-button"
        onClick={() => {
          startGame();
          safeGameMutate((game: { reset: () => void }) => {
            game.reset();
          });
          chessboardRef.current.clearPremoves();
        }}
      >
        start
      </button>
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((game: { undo: () => void }) => {
            game.undo();
          });
          chessboardRef.current.clearPremoves();
        }}
      >
        undo
      </button>
    </div>
  );
}
