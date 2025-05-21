import WebSocket from "ws";
import { Chess, Move } from "chess.js";
import { Socket } from "./socketManager";
import cuid from "cuid";
import {
  GameMove,
  GameOverType,
  GameStatus,
  MovePayload,
  Result,
} from "./types/types";
import Producer from "./kafka/producer";

// Time in milliseconds
export const TIME_LIMIT = 10 * 60 * 1000; // 10 minutes
export class Game {
  public gameId: string;
  public player1UserId: string | null;
  public player2UserId: string | null;
  private gameSocket: Socket;
  public gameResult: Result | null = null;
  public gameStatus: GameStatus = "active";
  public gameOverType: GameOverType | null = null;
  private board: Chess;
  private moveHistry: GameMove[] = [];
  private startTime: Date; // will be a metadata about the game.
  private lastMoveTime: Date;
  private gameTimeLimit: number;
  private player1TimeLeft: number = 0;
  private player2TimeLeft: number = 0;
  private gameTimer: NodeJS.Timeout | null = null;
  private producer: Producer;

  constructor(
    p1: WebSocket,
    p2: WebSocket,
    producer: Producer,
    timeLimit?: number,
    gameId?: string,
    player1UserId?: string,
    player2UserId?: string
  ) {
    this.gameId = gameId ? gameId : (cuid() as string);
    this.player1UserId = player1UserId ? player1UserId : null;
    this.player2UserId = player2UserId ? player2UserId : null;
    this.gameSocket = new Socket(this.gameId, p1, p2);
    this.board = new Chess();
    this.gameTimeLimit = timeLimit ? timeLimit * 60 * 1000 : TIME_LIMIT; //time limit should be in miliseconds
    this.player1TimeLeft = this.gameTimeLimit;
    this.player2TimeLeft = this.gameTimeLimit;
    console.log("game created, message sending");
    this.gameSocket.sendInitMsg(this.player1TimeLeft, this.player2TimeLeft);
    this.startTime = new Date(); // Initialize start time
    this.lastMoveTime = new Date();
    this.setGameTimer();
    console.log("send messages init_game");
    this.producer = producer;
    this.productInitMessage();
  }

  async productInitMessage() {
    await this.producer.send(
      {
        t: "init_game",
        d: {
          gameId: this.gameId,
          whitePlayerId: this.player1UserId ?? "",
          blackPlayerId: this.player2UserId ?? "",
          startTime: this.startTime,
          timeControl: this.gameTimeLimit,
          currentFen: this.board.fen(),
        },
      },
      this.gameId
    );
  }

  async makeMove(socket: WebSocket, move: string) {
    if (this.board.turn() === "w" && !this.gameSocket.comparePlayer1(socket)) {
      console.log("not your turn w", this.board.turn());
      return;
    }
    if (this.board.turn() === "b" && !this.gameSocket.comparePlayer2(socket)) {
      console.log("not your turn b", this.board.turn());
      return;
    }
    const currTime = new Date(Date.now());
    this.clearGameTimer();
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
      moveNumber: this.moveHistry.length + 1,
    };
    this.moveHistry.push(newMove);

    this.lastMoveTime = currTime;
    if (this.board.turn() === "w") {
      this.player2TimeLeft -= diff;
    } else {
      this.player1TimeLeft -= diff;
    }
    this.setGameTimer();

    console.log(this.board.turn());

    const movePayload: MovePayload | null = this.gameSocket.sendMove(
      newMove,
      this.player1TimeLeft,
      this.player2TimeLeft
    ); //send move to both players
    if (movePayload === null) {
      return;
    }

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
    await this.producer.send(movePayload, this.gameId);
  }

  handleDrawOffer(socket: WebSocket) {
    this.gameSocket.sendDrawOffer(socket);
  }

  private async gameEnd(type: GameOverType, winner: Result) {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.gameStatus = "over";
    this.gameResult = winner as Result;
    console.log("history:", this.moveHistry);
    try {
      const gameOverPayload = this.gameSocket.sendGameOverMsg(
        type,
        winner,
        this.player1TimeLeft,
        this.player2TimeLeft
      );
      if (gameOverPayload) {
        await this.producer.send(gameOverPayload, this.gameId);
      } else {
        this.handleError("", "Not able to send GameOverPayload to client");
      }
    } catch (error: any) {
      this.handleError(error, "Error while sending Game Over Message");
    }
  }

  clearGameTimer() {
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
    }
  }

  setGameTimer() {
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
    }

    const turn = this.board.turn();
    let timeRemain: number;

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
    // Print the time left in a human-readable format
    // TODO: Remove this in production.
    const formattedTime = this.formatTime(timeRemain);
    console.log(turn, formattedTime);
  }
  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
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
