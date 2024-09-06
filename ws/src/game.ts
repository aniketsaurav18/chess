import WebSocket from "ws";
import { Chess, Move } from "chess.js";
import { Socket } from "./socketManager";
import { randomUUID } from "crypto";
import { GameMove, GameOverType, GameStatus, Result } from "./types/types";

// Time in milliseconds
export const TIME_LIMIT = 10 * 60 * 1000; // 10 minutes
export class Game {
  public gameId: string;
  private gameSocket: Socket;
  public gameResult: Result | null = null;
  public gameStatus: GameStatus = "active";
  public gameOverType: GameOverType | null = null;
  private board: Chess;
  private moveHistry: GameMove[] = [];
  private startTime = new Date(Date.now());
  private lastMoveTime = new Date(Date.now());
  private gameTimeLimit = TIME_LIMIT;
  private player1TimeLeft = 0;
  private player2TimeLeft = 0;
  private gameTimer: NodeJS.Timeout | null = null;

  constructor(
    p1: WebSocket,
    p2: WebSocket,
    timeLimit?: number,
    gameId?: string
  ) {
    this.gameId = randomUUID() as string;
    this.gameSocket = new Socket(this.gameId, p1, p2);
    this.board = new Chess();
    this.gameTimeLimit = timeLimit ? timeLimit * 60 * 1000 : TIME_LIMIT; //time limit should be in miliseconds
    this.player1TimeLeft = this.gameTimeLimit;
    this.player2TimeLeft = this.gameTimeLimit;
    console.log("game created, message sending");
    this.gameSocket.sendInitMsg(this.player1TimeLeft, this.player2TimeLeft);
    this.setGameTimer();
    console.log("send messages init_game");
  }

  makeMove(socket: WebSocket, move: string) {
    if (this.board.turn() === "w" && !this.gameSocket.comparePlayer1(socket)) {
      console.log("not your turn w", this.board.turn());
      return;
    }
    if (this.board.turn() === "b" && !this.gameSocket.comparePlayer2(socket)) {
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
    const newMove: GameMove = {
      ...m,
      time: diff,
    };
    this.moveHistry.push(newMove);

    this.lastMoveTime = currTime;
    if (this.board.turn() === "w") {
      this.player2TimeLeft -= diff;
    } else {
      this.player1TimeLeft -= diff;
    }
    //TODO - reset timer.
    
    //TODO - send move to a kafka server for inserting into DB

    console.log(this.board.turn());

    this.gameSocket.sendMove(
      newMove,
      this.player1TimeLeft,
      this.player2TimeLeft
    ); //send move to both players

    if (this.board.isGameOver()) {
      let type: GameOverType | "unknown";
      let winner: Result;
      if (this.board.isCheckmate()) {
        console.log("checkmate", this.board.turn());
        type =
          this.board.turn() === "w" ? "white_checkmate" : "black_checkmate";
        winner = this.board.turn() === "w" ? "black" : "white";
      } else if (this.board.isDraw()) {
        console.log("draw", this.board.turn());
        type = "draw";
        winner = "draw";
      } else if (this.board.isThreefoldRepetition()) {
        console.log("threefold repetition", this.board.turn());
        type = "threefold_repetition";
        winner = "draw";
      } else if (this.board.isInsufficientMaterial()) {
        console.log("insufficient material", this.board.turn());
        type = "insufficient_material";
        winner = "draw";
      } else if (this.board.isStalemate()) {
        console.log("stalemate", this.board.turn());
        type =
          this.board.turn() === "w" ? "black_stalemate" : "white_stalemate";
        winner = "draw";
      } else {
        console.log("game over", this.board.turn());
        type = "unknown";
        winner = "draw";
      }
      this.gameEnd(type, winner);
    }
  }

  handleDrawOffer(socket: WebSocket) {
    this.gameSocket.sendDrawOffer(socket);
  }

  private gameEnd(type: GameOverType, winner: Result) {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.gameStatus = "over";
    this.gameResult = winner as Result;
    try {
      this.gameSocket.sendGameOverMsg(
        type,
        winner,
        this.player1TimeLeft,
        this.player2TimeLeft
      );
    } catch (error: any) {
      this.handleError(error, "Error while sending Game Over Message");
    }
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
      timeRemain = this.player1TimeLeft;
    } else {
      timeRemain = this.player2TimeLeft;
    }
    this.gameTimer = setTimeout(() => {
      console.log(turn === "w" ? "black" : "white", "timeout");
      this.gameEnd(
        turn === "w" ? "white_timeout" : "black_timeout",
        turn === "w" ? "black" : "white"
      );
    }, timeRemain);
  }

  resign(socket: WebSocket) {
    if (this.gameSocket.comparePlayer1(socket)) {
      this.gameEnd("white_resign", "black");
    } else {
      this.gameEnd("black_resign", "white");
    }
  }

  gameDraw() {
    this.gameEnd("draw", "draw");
  }

  private handleError(error: any, context: string) {
    console.error(
      `Error GameId:${this.gameId} error-message: ${context} err: ${
        error.message || error
      }`
    );
    // TODO: send the error to a monitoring service
  }
}
