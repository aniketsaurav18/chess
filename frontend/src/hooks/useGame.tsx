import { useEffect, useRef, useState } from "react";
import { Chess, Square } from "chess.js";
import { useSocket } from "../hooks/useSocket";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import {
  INIT_GAME,
  MOVE,
  GAME_OVER,
  TIMEOUT,
  OFFER_DRAW,
  DRAW_OFFERED,
  DRAW_ACCEPTED,
} from "../utils/messages";

// const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

export function useChessGame(user: any) {
  const socket = useSocket();
  const chessboardRef = useRef<any>();
  const [game, _setGame] = useState(new Chess());
  const [gameState, setGameState] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState<
    "STARTED" | "OVER" | "WAITING" | "IDEAL"
  >("IDEAL");
  const [waiting, setWaiting] = useState(false);
  const [side, setSide] = useState<BoardOrientation>("white");
  const [player1timer, setPlayer1Timer] = useState<number>(0);
  const [player2timer, setPlayer2Timer] = useState<number>(0);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({}); // for highlighting possible moves
  const [gameHistory, setGameHistory] = useState<any>([]);
  const [offerDraw, setOfferDraw] = useState<boolean>(false); // player offered a draw
  const [drawOffered, setDrawOffered] = useState<boolean>(false); // a draw was offered to player
  const player1TimerRef = useRef<NodeJS.Timeout | null>(null);
  const player2TimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("user details", user);
  }, [user]);

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
          setWaiting(false);
          break;
        case MOVE:
          const move = game.move(message.d.san);
          if (!move) {
            break;
          }
          setGameState(game.fen());
          setPlayer1Timer(message.clock.white);
          setPlayer2Timer(message.clock.black);
          updateHistory(move);
          break;
        case GAME_OVER:
          setGameStatus("OVER");
          break;
        case TIMEOUT:
          setGameStatus("OVER");
          break;
        case DRAW_OFFERED:
          if (drawOffered) break;
          setDrawOffered(true);
          setTimeout(() => {
            setDrawOffered(false);
          }, 5000);
          break;
        case DRAW_ACCEPTED:
          setGameStatus("OVER");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (gameStatus !== "STARTED") {
      return;
    }
    // @ts-expect-error
    if (gameStatus === "OVER") {
      //why this is an error?
      clearAllInterval();
    }

    clearAllInterval();
    setPlayerTimer();
    return () => clearAllInterval();
  }, [gameStatus, game.turn()]);

  const setPlayerTimer = () => {
    if (game.turn() === "w") {
      player1TimerRef.current = setInterval(() => {
        setPlayer1Timer((t) => t + 100);
      }, 100);
    } else if (game.turn() === "b") {
      player2TimerRef.current = setInterval(() => {
        setPlayer2Timer((t) => t + 100);
      }, 100);
    }
  };
  const clearAllInterval = () => {
    if (player1TimerRef.current) {
      console.log("clearing player1 timer");
      clearInterval(player1TimerRef.current);
      player1TimerRef.current = null;
    }
    if (player2TimerRef.current) {
      console.log("clearing player2 timer");
      clearInterval(player2TimerRef.current);
      player2TimerRef.current = null;
    }
  };

  const makeMove = (sourceSquare: Square, targetSquare: Square) => {
    if (
      game.get(sourceSquare)?.color !== game.turn() ||
      game.turn() !== side[0]
    )
      return false;
    if (!socket) return false;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });
    if (!move) {
      return false;
    }
    setGameState(game.fen());
    try {
      socket?.send(
        JSON.stringify({
          t: MOVE,
          d: {
            m: move.san,
          },
        })
      );
    } catch (e: any) {
      console.log(e);
      return false;
    }
    updateHistory(move);
    return true;
  };

  const offerDrawfn = () => {
    if (offerDraw) return;
    setOfferDraw(true);
    socket?.send(
      JSON.stringify({
        t: OFFER_DRAW,
        d: {
          player: side[0],
        },
      })
    );
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
      socket.send(JSON.stringify({ t: INIT_GAME }));
      setWaiting(true);
      game.reset();
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

  return {
    gameState,
    gameStatus,
    player1timer,
    player2timer,
    optionSquares,
    moveFrom,
    offerDraw,
    drawOffered,
    setDrawOffered,
    gameHistory,
    chessboardRef,
    side,
    waiting,
    makeMove,
    onSquareClick,
    startGame,
    offerDrawfn,
  };
}