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
import { User } from "./useUser";

// const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

export function useChessGame(user: User) {
  const socket = useSocket();
  const chessboardRef = useRef<any>();
  const [game, _setGame] = useState(new Chess());
  // const [oponent, setOponent] = useState(null);
  const [gameId, setGameID] = useState<string | null>(null);
  const [gameState, setGameState] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState<GameStatus>("IDEAL");
  const gameStatusRef = useRef<GameStatus>("IDEAL");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [waiting, setWaiting] = useState(false);
  const [side, setSide] = useState<BoardOrientation>("white");
  const [turn, setTurn] = useState<PieceColor>("w");
  const [player1clock, setplayer1clock] = useState<number>(600000);
  const [player2clock, setplayer2clock] = useState<number>(600000);
  const [gameHistory, setGameHistory] = useState<any>([]);
  const [offerDraw, setOfferDraw] = useState<boolean>(false); // player offered a draw
  const [drawOffered, setDrawOffered] = useState<boolean>(false); // a draw was offered to player
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    console.log("user details", user);
  }, [user]);

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  const gameEndfn = useCallback(
    (msgPayload: any) => {
      if (msgPayload == null) {
        return;
      }
      if (gameStatus === "STARTED") {
        setGameStatus("OVER");
      }
      setTimeout(() => {
        setGameResult(msgPayload.msg);
        setIsGameOver(true);
        setWinner(msgPayload.winner);
      }, 500);
    },
    [setGameStatus, setGameResult, setIsGameOver, setWinner, gameStatus]
  );

  const updateHistory = useCallback(
    (move: any) => {
      setGameHistory((history: any) => {
        const lastMoveWithTime = {
          ...game.history({ verbose: true })[game.history().length - 1],
          time: move.color === "w" ? player1clock : player2clock,
        };
        return [...history, lastMoveWithTime];
      });
    },
    [setGameHistory, game, player1clock, player2clock]
  );

  const handleSocketMessage = useCallback(
    (event: MessageEvent) => {
      if (!socket) return;
      const message = JSON.parse(event.data);
      console.log("incoming message", message);
      switch (message.t) {
        case INIT_GAME:
          setSide(message.d.color);
          console.log(side);
          console.log(message.d.color);
          setGameID(message.d.id);
          setplayer1clock(message.d.clock.w);
          setplayer2clock(message.d.clock.b);
          setGameStatus("STARTED");
          console.log("game status", gameStatus);
          setWaiting(false);
          break;
        case MOVE:
          // if it is just an echo of the move, ignore it.
          if ((message.d.c as string) === side[0]) {
            console.log("message side:", message.d.c);
            console.log("side", side);
            console.log("echo move");
            break;
          }
          const move = game.move(message.d.san);
          console.log("played move:", move);
          if (!move) {
            break;
          }
          setGameState(game.fen());
          setplayer1clock(message.d.clock.w);
          setplayer2clock(message.d.clock.b);
          updateHistory(move);
          console.log("turn changes", game.turn());
          setTurn(game.turn());
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
    },
    [
      socket,
      setSide,
      setGameID,
      setplayer1clock,
      setplayer2clock,
      setGameStatus,
      setWaiting,
      side,
      turn,
      setTurn,
      gameStatus,
      setGameState,
      setGameResult,
      setIsGameOver,
      setWinner,
      setGameHistory,
      setOfferDraw,
      setDrawOffered,
      updateHistory,
      game,
      setGameState,
      updateHistory,
      gameEndfn,
      drawOffered,
      setDrawOffered,
    ]
  );

  useEffect(() => {
    if (!socket || !user) {
      console.log("either socker or user is invalid", user);
      return;
    }
    socket.onmessage = handleSocketMessage;
  }, [socket, handleSocketMessage, user]);

  const makeMove = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
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
      setTurn(game.turn()); // important the timer depents on this
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
    },
    [socket, game, side, gameStatus, gameId, setGameState, updateHistory, turn]
  );

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
  }, [socket, gameId, side, offerDraw, setOfferDraw]);

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
  }, [socket, gameStatus, gameId, side, gameEndfn, setDrawOffered]);

  const drawDeclinedfn = useCallback(() => {
    if (gameStatus !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_DECLINED, d: { color: side[0] } }));
    setDrawOffered(false);
  }, [socket, gameStatus, side, setDrawOffered]);

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
              userId: user.userId ?? null,
              token: user.token ?? null,
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
    winner,
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
