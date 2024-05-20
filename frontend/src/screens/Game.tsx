import "./Game.css";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import defaultUserImage from "../assets/default-user.jpg";
import GameInfo from "../components/GameInfo";
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

const GAME_TIME_LIMIT = 600000; // 10 minutes

// const WS_URL = "ws://localhost:8080";

// interface GameMetadata {
//   player1: string;
//   player2: string;
// }

export function Game() {
  const socket = useSocket();
  const windowDimensions = useWindowDimensions();
  const chessboardRef = useRef<any>();
  const [boardWidth, setBoardWidth] = useState<number>(500);
  const [game, setGame] = useState(new Chess());
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  // const [gameMetadata, setGameMetadata] = useState<GameMetadata | null>(null);
  const [side, setSide] = useState<BoardOrientation>("white");
  const [player1timer, setPlayer1Timer] = useState<number>(0);
  const [player2timer, setPlayer2Timer] = useState<number>(0);
  // const player1timerRef = useRef(player1timer);
  // const player2timerRef = useRef(player2timer);
  const [gameHistory, setGameHistory] = useState<any>([]);

  const startGame = () => {
    if (!socket) {
      console.log("no socket found");
      return null;
    }
    try {
      console.log("start game");
      socket.send(JSON.stringify({ type: INIT_GAME }));
      setWaiting(true);
      safeGameMutate((game: { reset: () => void }) => {
        game.reset();
      });
      chessboardRef.current.clearPremoves();
      return true;
    } catch (e) {
      setWaiting(false);
      return null;
    }
  };

  useEffect(() => {
    if (windowDimensions.width === null) return;
    if (windowDimensions.width < 500) {
      setBoardWidth(windowDimensions.width - 20);
    } else {
      if (windowDimensions.height !== null) {
        setBoardWidth(windowDimensions.height - 200);
      } else {
        setBoardWidth(600);
      }
    }
  }, [windowDimensions.width]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("incoming message", message);
      switch (message.type) {
        case INIT_GAME:
          setSide(message.payload.color);
          setStarted((started) => !started);
          // console.log("init started ", started);
          setWaiting(false);
          break;
        case MOVE:
          console.log("move", message.payload.move);
          // makeMove(message.payload.move.from, message.payload.move.to);
          const gameCopy = { ...game };
          const move = gameCopy.move({
            from: message.payload.move.from,
            to: message.payload.move.to,
            promotion: "q", // always promote to a queen for example simplicity
          });
          if (!move) {
            break;
          }
          console.log("move", move);
          setGame(gameCopy);
          let lastMoveWithTime;
          if (move.color === "w") {
            lastMoveWithTime = {
              ...game.history({ verbose: true })[game.history().length - 1],
              time: player1timer,
            };
          } else {
            lastMoveWithTime = {
              ...game.history({ verbose: true })[game.history().length - 1],
              time: player2timer,
            };
          }
          setGameHistory((history: any) => [...history, lastMoveWithTime]);
          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  }, [socket, player1timer, player2timer]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      if (game.turn() === "w") {
        setPlayer1Timer((t) => t + 100);
      } else {
        setPlayer2Timer((t) => t + 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [started, game.turn()]);

  function safeGameMutate(modify: any) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const gameTimer = (timeConsumed: number) => {
    const timeLeftMs = GAME_TIME_LIMIT - timeConsumed;
    const timeINMinutes = Math.floor(timeLeftMs / 60000);
    const timeInSeconds = Math.floor((timeLeftMs % 60000) / 1000);
    return (
      <div className="game-timer">
        {timeINMinutes < 10 ? "0" : ""}
        {timeINMinutes}:{timeInSeconds < 10 ? "0" : ""}
        {timeInSeconds}
      </div>
    );
  };

  const makeMove = (sourceSquare: Square, targetSquare: Square) => {
    if (game.get(sourceSquare)?.color !== game.turn()) return false;
    console.log(started);
    if (!socket) return false;
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    if (!move) {
      return false;
    }
    console.log("move", move);
    try {
      const msgsend = JSON.stringify({
        type: MOVE,
        payload: {
          move: {
            from: sourceSquare,
            to: targetSquare,
          },
        },
      });
      console.log(msgsend);
      socket?.send(msgsend);
    } catch (e: any) {
      console.log(e);
      return false;
    }
    setGame(gameCopy);
    let lastMoveWithTime;
    if (move.color === "w") {
      lastMoveWithTime = {
        ...game.history({ verbose: true })[game.history().length - 1],
        time: player1timer,
      };
    } else {
      lastMoveWithTime = {
        ...game.history({ verbose: true })[game.history().length - 1],
        time: player2timer,
      };
    }
    setGameHistory((history: any) => [...history, lastMoveWithTime]);
    return true;
  };

  return (
    <div className="game-main">
      <div className="game-board">
        <div className="player-metadata" style={{ width: boardWidth }}>
          <div className="player-profile">
            <img src={defaultUserImage} alt={defaultUserImage} />
            <span>Username</span>
          </div>
          {side === "white" ? gameTimer(player2timer) : gameTimer(player1timer)}
        </div>
        <div className="chessboard">
          <Chessboard
            id="PlayVsPlay"
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
        </div>

        <div className="player-metadata" style={{ width: boardWidth }}>
          <div className="player-profile">
            <img src={defaultUserImage} alt={defaultUserImage} />
            <span>Username</span>
          </div>
          {side === "white" ? gameTimer(player1timer) : gameTimer(player2timer)}
        </div>
      </div>
      <GameInfo
        socket={socket}
        startGame={startGame}
        started={started}
        waiting={waiting}
        gameHistory={gameHistory}
      />
    </div>
  );
}
