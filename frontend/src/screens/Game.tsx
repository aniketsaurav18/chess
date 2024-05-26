import "./Game.css";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import defaultUserImage from "../assets/default-user.jpg";
import GameInfo from "../components/GameInfo";
import Sidebar from "../components/Sidebar";
import {
  INIT_GAME,
  MOVE,
  GAME_OVER,
  TIMEOUT,
  OFFER_DRAW,
  DRAW_OFFERED,
} from "../utils/messages";
import Topbar from "../components/Topbar";

const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

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
  const [gameStatus, setGameStatus] = useState<
    "STARTED" | "OVER" | "WAITING" | "IDEAL"
  >("IDEAL");
  const [waiting, setWaiting] = useState(false);
  // const [gameMetadata, setGameMetadata] = useState<GameMetadata | null>(null);
  const [side, setSide] = useState<BoardOrientation>("white");
  const [player1timer, setPlayer1Timer] = useState<number>(0);
  const [player2timer, setPlayer2Timer] = useState<number>(0);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({}); // for highlighting possible moves
  const [gameHistory, setGameHistory] = useState<any>([]);
  const [offerDraw, setOfferDraw] = useState<boolean>(false); // player offered a draw
  const [drawOffered, setDrawOffered] = useState<boolean>(false); // a draw was offered to player
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  useEffect(() => {
    if (windowDimensions.width === null || windowDimensions.height === null)
      return;

    const width = document.getElementsByClassName("game-board")[0].clientWidth;
    const height = windowDimensions.height;
    setBoardWidth(Math.min(width - 40, height - 165));
  }, [windowDimensions.width]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("incoming message", message);
      switch (message.t) {
        case INIT_GAME:
          setSide(message.d.color);
          setGameStatus("STARTED");
          // console.log("init gameStatus ", gameStatus);
          setWaiting(false);
          break;
        case MOVE:
          console.log("move", message.d.san);
          // makeMove(message.d.move.from, message.d.move.to);
          const gameCopy = { ...game };
          const move = gameCopy.move(message.d.san);
          if (!move) {
            break;
          }
          console.log("move", move);
          setGame(gameCopy);
          setPlayer1Timer(message.clock.white);
          setPlayer2Timer(message.clock.black);
          updateHistory(move);
          break;
        case GAME_OVER:
          console.log("game over");
          break;
        case TIMEOUT:
          if (gameStatus) {
            setGameStatus("OVER");
          }
          break;
        case DRAW_OFFERED:
          if (drawOffered) break;
          console.log("draw offered");
          setDrawOffered(true);
          setTimeout(() => {
            setDrawOffered(false);
          }, 5000);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (gameStatus !== "STARTED") return;
    const interval = setInterval(() => {
      if (game.turn() === "w") {
        setPlayer1Timer((t) => t + 100);
      } else {
        setPlayer2Timer((t) => t + 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [gameStatus, game.turn()]);

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
    if (
      game.get(sourceSquare)?.color !== game.turn() ||
      game.turn() !== side[0]
    )
      return false;
    console.log(gameStatus);
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
        t: MOVE,
        d: {
          m: move.san,
        },
      });
      console.log(msgsend);
      socket?.send(msgsend);
    } catch (e: any) {
      console.log(e);
      return false;
    }
    setGame(gameCopy);
    updateHistory(move);
    return true;
  };

  const offerDrawfn = () => {
    if (offerDraw) return;
    setOfferDraw(true);
    const msgsend = JSON.stringify({
      t: OFFER_DRAW,
      d: {
        player: side[0],
      },
    });
    socket?.send(msgsend);
    setTimeout(() => {
      setOfferDraw(false);
    }, 5000);
  };

  const startGame = () => {
    if (!socket) {
      console.log("no socket found");
      return null;
    }
    try {
      console.log("start game");
      socket.send(JSON.stringify({ t: INIT_GAME }));
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

  const updateHistory = (move: any) => {
    setGameHistory((history: any) => {
      const lastMoveWithTime = {
        ...game.history({ verbose: true })[game.history().length - 1],
        time: move.color === "w" ? player1timer : player2timer,
      };
      return [...history, lastMoveWithTime];
    });
  };

  function getMoveOptions(square: Square) {
    if (game.turn() !== side[0] && gameStatus !== "STARTED") return;

    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares: any = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    console.log("newSquare", newSquares);
    setOptionSquares(newSquares);
  }

  const onSquareClick = (square: Square) => {
    if (game.turn() !== side[0]) return;
    if (!moveFrom) {
      if (game.get(square)?.color !== game.turn()) return;
      getMoveOptions(square);
      setMoveFrom(square);
    } else {
      if (!Object.keys(optionSquares).includes(square)) {
        getMoveOptions(square);
        setMoveFrom(square);
        return;
      }
      if (makeMove(moveFrom, square)) {
        setMoveFrom(null);
        setOptionSquares({});
      }
    }
  };

  return (
    <main className="main">
      <Sidebar
        sidebar={sidebarOpen}
        windowSize={windowDimensions.width ? windowDimensions.width : 1251}
      />
      <Topbar setSidebarOpen={setSidebarOpen} sidebar={sidebarOpen} />
      <div className="game-main">
        <div className="game-board">
          <div className="player-metadata" style={{ width: boardWidth }}>
            <div className="player-profile">
              <img src={defaultUserImage} alt={defaultUserImage} />
              <span>Username</span>
            </div>
            {side === "white"
              ? gameTimer(player2timer)
              : gameTimer(player1timer)}
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
              areArrowsAllowed={true}
              arePremovesAllowed={true}
              onSquareClick={onSquareClick}
              customSquareStyles={{
                ...optionSquares,
              }}
            />
          </div>

          <div className="player-metadata" style={{ width: boardWidth }}>
            <div className="player-profile">
              <img src={defaultUserImage} alt={defaultUserImage} />
              <span>Username</span>
            </div>
            {side === "white"
              ? gameTimer(player1timer)
              : gameTimer(player2timer)}
          </div>
        </div>
        <GameInfo
          side={side}
          socket={socket}
          startGame={startGame}
          status={gameStatus}
          waiting={waiting}
          gameHistory={gameHistory}
          drawOffered={drawOffered}
          setDrawOffered={setDrawOffered}
          offerDrawfn={offerDrawfn}
          offerDraw={offerDraw}
        />
      </div>
    </main>
  );
}
