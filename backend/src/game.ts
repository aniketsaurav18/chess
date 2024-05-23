import { WebSocket } from "ws";
import { Chess, Move } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, GAME_DRAW, TIMEOUT } from "./messages";
import { randomUUID } from "crypto";
// import { GameMove } from "./types/types";
export interface GameMove {
  t: number;
  f: string;
  m: string;
}
export type Result = "white" | "black" | "draw";
export type GameStatus = "active" | "over";

// Time in milliseconds
export const TIME_LIMIT = 1 * 60 * 1000; // 10 minutes
export class Game {
  public gameId: string;
  public player1: WebSocket | null;
  public player2: WebSocket | null;
  public gameResult: Result | null = null;
  public gameStatus: GameStatus = "active";
  private board: Chess;
  private moveHistry: GameMove[] = [];
  private startTime = new Date(Date.now());
  private lastMoveTime = new Date(Date.now());
  private player1TimeConsumed = 0;
  private player2TimeConsumed = 0;
  private gameTimer: NodeJS.Timeout | null = null;

  constructor(p1: WebSocket | null, p2: WebSocket | null, gameId?: string) {
    this.gameId = randomUUID();
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    console.log("game created, message sending");
    this.player1?.send(
      JSON.stringify({
        t: INIT_GAME,
        d: {
          color: "white",
        },
      })
    );
    this.player2?.send(
      JSON.stringify({
        t: INIT_GAME,
        d: {
          color: "black",
        },
      })
    );
    this.setGameTimer();
    console.log("send messages init_game");
  }

  makeMove(socket: WebSocket, move: string) {
    if (this.board.turn() === "w" && socket !== this.player1) {
      console.log("not your turn w", this.board.turn());
      return;
    }
    if (this.board.turn() === "b" && socket !== this.player2) {
      console.log("not your turn b", this.board.turn());
      return;
    }
    const currTime = new Date(Date.now());
    const m = this.board.move(move);
    if (!m) {
      console.log("invalid move");
      return;
    }
    //calculating curr time and remaining time of players
    const diff = currTime.getTime() - this.lastMoveTime.getTime();

    this.moveHistry.push({
      m: m.san,
      f: m.after,
      t: currTime.getTime() - this.lastMoveTime.getTime(),
    }); // Pushing the move into move history.

    this.lastMoveTime = currTime;
    if (this.board.turn() === "w") {
      this.player2TimeConsumed += diff;
    } else {
      this.player1TimeConsumed += diff;
    }

    //TODO - send move to a kafka server for inserting into DB

    console.log(this.board.turn());
    if (this.board.turn() === "b") {
      this.player2?.send(
        JSON.stringify({
          t: MOVE,
          d: {
            san: m.san,
            f: m.after,
            ply: this.moveHistry.length,
          },
          clock: {
            white: this.player1TimeConsumed,
            black: this.player2TimeConsumed,
          },
        })
      );
    } else {
      this.player1?.send(
        JSON.stringify({
          t: MOVE,
          d: {
            san: m.san,
            f: m.after,
            ply: this.moveHistry.length,
          },
          clock: {
            white: this.player1TimeConsumed,
            black: this.player2TimeConsumed,
          },
        })
      );
    }
    if (this.board.isDraw()) {
      this.player1?.send(
        JSON.stringify({
          t: GAME_DRAW,
          d: {
            winner: "draw",
          },
        })
      );
      this.player2?.send(
        JSON.stringify({
          t: GAME_DRAW,
          d: {
            winner: "draw",
          },
        })
      );
    }
    if (this.board.isGameOver()) {
      if (
        this.board.isStalemate() ||
        this.board.isThreefoldRepetition() ||
        this.board.isInsufficientMaterial()
      ) {
        this.player1?.send(
          JSON.stringify({
            t: GAME_DRAW,
            d: {
              winner: "draw",
            },
          })
        );
        this.player2?.send(
          JSON.stringify({
            t: GAME_DRAW,
            d: {
              winner: "draw",
            },
          })
        );
      } else {
        this.player1?.send(
          JSON.stringify({
            t: GAME_OVER,
            d: {
              winner: this.board.turn() === "w" ? "white" : "black",
            },
          })
        );
        this.player2?.send(
          JSON.stringify({
            t: GAME_OVER,
            d: {
              winner: this.board.turn() === "w" ? "white" : "black",
            },
          })
        );
      }
    }
  }

  gameEnd(type: string, msg: string) {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.player1?.send(
      JSON.stringify({
        t: type,
        d: {
          winner: msg,
        },
      })
    );
    this.player2?.send(
      JSON.stringify({
        t: type,
        d: {
          winner: msg,
        },
      })
    );
  }

  clearGameTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
  }

  setGameTimer() {
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
    }
    const turn = this.board.turn();
    let timeRemain;
    if (turn === "w") {
      timeRemain = TIME_LIMIT - this.player1TimeConsumed;
    } else {
      timeRemain = TIME_LIMIT - this.player2TimeConsumed;
    }
    this.gameTimer = setTimeout(() => {
      console.log(turn === "w" ? "black" : "white", "timeout");
      this.gameEnd(TIMEOUT, turn === "w" ? "black" : "white");
    }, timeRemain);
  }
}
