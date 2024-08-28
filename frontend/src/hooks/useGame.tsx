import { useEffect, useRef, useState } from "react";
import { Chess, Square } from "chess.js";
import { useSocket } from "../hooks/useSocket";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import {
  INIT_GAME,
  MOVE,
  GAME_OVER,
  // TIMEOUT,
  OFFER_DRAW,
  DRAW_OFFERED,
  DRAW_ACCEPTED,
  // GAME_DRAW,
  RESIGN,
  DRAW_DECLINED,
} from "../utils/messages";

// const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

export function useChessGame(user: any) {
  const socket = useSocket();
  const chessboardRef = useRef<any>();
  const [game, _setGame] = useState(new Chess());
  // const [oponent, setOponent] = useState(null);
  const [gameId, setGameID] = useState<string | null>(null);
  const [gameState, setGameState] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState<
    "STARTED" | "OVER" | "WAITING" | "IDEAL"
  >("IDEAL");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
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
  const [gameResult, setGameResult] = useState<string | null>(null);

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
          setGameID(message.d.id);
          setPlayer1Timer(message.d.clock.w);
          setPlayer2Timer(message.d.clock.b);
          setGameStatus("STARTED");
          setWaiting(false);
          break;
        case MOVE:
          const move = game.move(message.d.san);
          if (!move) {
            break;
          }
          setGameState(game.fen());
          clearAllInterval();
          setPlayer1Timer(message.d.clock.w);
          setPlayer2Timer(message.d.clock.b);
          setPlayerTimer();
          updateHistory(move);
          break;
        case GAME_OVER:
          gameEndfn(message.d);
          break;
        case DRAW_OFFERED:
          if (drawOffered) break;
          setDrawOffered(true);
          setTimeout(() => {
            setDrawOffered(false);
          }, 5000);
          break;
      }
    };
  }, [socket]);

  useEffect(() => {
    if (gameStatus !== "STARTED") {
      return;
    }
    console.log("status", gameStatus, "game turn", game.turn());
    clearAllInterval();
    setPlayerTimer();
    return () => clearAllInterval();
  }, [gameStatus, game.turn()]);

  const setPlayerTimer = () => {
    if (gameStatus === "OVER") {
      return;
    }
    if (game.turn() === "w") {
      console.log("setting white timer");
      player1TimerRef.current = setInterval(() => {
        setPlayer1Timer((t) => t - 100);
      }, 100);
    } else if (game.turn() === "b") {
      console.log("setting black timer");
      player2TimerRef.current = setInterval(() => {
        setPlayer2Timer((t) => t - 100);
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
  const gameEndfn = (msgPayload: any) => {
    if (msgPayload == null) {
      clearAllInterval();
      return;
    }
    if (gameStatus === "STARTED") {
      setGameStatus("OVER");
    }
    setTimeout(() => {
      clearAllInterval();
      setGameResult(msgPayload.msg);
      setIsGameOver(true);
    }, 500);
  };

  const makeMove = (sourceSquare: Square, targetSquare: Square) => {
    if (
      game.get(sourceSquare)?.color !== game.turn() ||
      game.turn() !== side[0] ||
      gameStatus !== "STARTED"
    )
      return false;
    if (!socket) return false;
    setMoveFrom(null);
    setOptionSquares({});
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
            gameId: gameId,
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

  const gameResign = () => {
    if (gameStatus !== "STARTED") {
      return;
    }
    try {
      socket?.send(
        JSON.stringify({
          t: RESIGN,
          d: {
            gameId: gameId,
            player: side[0],
          },
        })
      );
      clearAllInterval();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const offerDrawfn = () => {
    if (offerDraw) return;
    setOfferDraw(true);
    socket?.send(
      JSON.stringify({
        t: OFFER_DRAW,
        d: {
          gameId: gameId,
          player: side[0],
        },
      })
    );
    setTimeout(() => {
      setOfferDraw(false);
    }, 5000);
  };

  const drawAcceptedfn = () => {
    if (gameStatus !== "STARTED" || !socket) {
      return;
    }
    socket.send(
      JSON.stringify({
        t: DRAW_ACCEPTED,
        d: { gameId: gameId, color: side[0] },
      })
    );
    setDrawOffered(false);
    gameEndfn(null);
  };

  const drawDeclinedfn = () => {
    if (gameStatus !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_DECLINED, d: { color: side[0] } }));
    setDrawOffered(false);
  };

  const startGame = (timeLimit: number): boolean => {
    if (!socket) {
      console.log("no socket found");
      return false;
    }
    try {
      setWaiting(true);
      socket.send(
        JSON.stringify({
          t: INIT_GAME,
          d: {
            tl: timeLimit,
          },
        })
      );
      game.reset();
      chessboardRef.current.clearPremoves();
      return true;
    } catch (e) {
      setWaiting(false);
      return false;
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
    gameId,
    gameState,
    gameStatus,
    gameResult,
    isGameOver,
    player1timer,
    player2timer,
    optionSquares,
    moveFrom,
    offerDraw,
    gameResign,
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
    drawAcceptedfn,
    drawDeclinedfn,
  };
}
