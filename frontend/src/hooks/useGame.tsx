import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, PieceColor, Square } from "chess.js";
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
  const [turn, setTurn] = useState<PieceColor>("w");
  const [player1clock, setplayer1clock] = useState<number>(60000);
  const [player2clock, setplayer2clock] = useState<number>(60000);
  // const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  // const [optionSquares, setOptionSquares] = useState<any>({});
  const [gameHistory, setGameHistory] = useState<any>([]);
  const [offerDraw, setOfferDraw] = useState<boolean>(false); // player offered a draw
  const [drawOffered, setDrawOffered] = useState<boolean>(false); // a draw was offered to player
  // const player1clockRef = useRef<NodeJS.Timeout | null>(null);
  // const player2clockRef = useRef<NodeJS.Timeout | null>(null);
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
          setplayer1clock(message.d.clock.w);
          setplayer2clock(message.d.clock.b);
          setGameStatus("STARTED");
          setWaiting(false);
          break;
        case MOVE:
          const move = game.move(message.d.san);
          if (!move) {
            break;
          }
          setGameState(game.fen());
          // clearAllInterval();
          setplayer1clock(message.d.clock.w);
          setplayer2clock(message.d.clock.b);
          // setPlayerTimer();
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
    setTurn(game.turn());
    // clearAllInterval();
    // setPlayerTimer();
    // return () => clearAllInterval();
  }, [gameStatus, game.turn()]);

  // const setPlayerTimer = () => {
  //   if (gameStatus === "OVER") {
  //     return;
  //   }
  //   if (game.turn() === "w") {
  //     console.log("setting white timer");
  //     player1clockRef.current = setInterval(() => {
  //       setplayer1clock((t) => t - 100);
  //     }, 100);
  //   } else if (game.turn() === "b") {
  //     console.log("setting black timer");
  //     player2clockRef.current = setInterval(() => {
  //       setplayer2clock((t) => t - 100);
  //     }, 100);
  //   }
  // };
  // const clearAllInterval = () => {
  //   if (player1clockRef.current) {
  //     console.log("clearing player1 timer");
  //     clearInterval(player1clockRef.current);
  //     player1clockRef.current = null;
  //   }
  //   if (player2clockRef.current) {
  //     console.log("clearing player2 timer");
  //     clearInterval(player2clockRef.current);
  //     player2clockRef.current = null;
  //   }
  // };
  const gameEndfn = (msgPayload: any) => {
    if (msgPayload == null) {
      // clearAllInterval();
      return;
    }
    if (gameStatus === "STARTED") {
      setGameStatus("OVER");
    }
    setTimeout(() => {
      // clearAllInterval();
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

  const gameResign = useCallback(() => {
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
      // clearAllInterval();
    } catch (e: any) {
      console.log(e.message);
    }
  }, [socket, gameStatus, gameId, side]);

  const offerDrawfn = useCallback(() => {
    if (offerDraw) return;
    console.log("draw offered");
    setOfferDraw(true);
    try {
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
    } catch (e) {
      console.log("error while offering draw", e);
    }
  }, [socket, gameId, side]);

  const drawAcceptedfn = useCallback(() => {
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
  }, [socket, gameStatus, gameId, side, gameEndfn]);

  const drawDeclinedfn = useCallback(() => {
    if (gameStatus !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_DECLINED, d: { color: side[0] } }));
    setDrawOffered(false);
  }, [socket, gameStatus, side]);

  const startGame = useCallback(
    (timeLimit: number): boolean => {
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
        console.log("start Game error:", e);
        setWaiting(false);
        return false;
      }
    },
    [socket, game, chessboardRef]
  );

  const updateHistory = (move: any) => {
    setGameHistory((history: any) => {
      const lastMoveWithTime = {
        ...game.history({ verbose: true })[game.history().length - 1],
        time: move.color === "w" ? player1clock : player2clock,
      };
      return [...history, lastMoveWithTime];
    });
  };

  return {
    gameId,
    gameState,
    gameStatus,
    turn,
    gameResult,
    isGameOver,
    player1clock,
    player2clock,
    offerDraw,
    gameResign,
    drawOffered,
    setDrawOffered,
    gameHistory,
    chessboardRef,
    side,
    waiting,
    makeMove,
    startGame,
    offerDrawfn,
    drawAcceptedfn,
    drawDeclinedfn,
  };
}
