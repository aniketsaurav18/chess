import { WebSocket } from "ws";
import {
  GameMessagePayload,
  InitGamePayload,
  MovePayload,
  GameOverPayload,
  GameMove,
  GameOverType,
  Result,
  gameOverMessages,
} from "./types/types";
import {
  DRAW_OFFERED,
  GAME_DRAW,
  GAME_OVER,
  INIT_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  TIMEOUT,
} from "./messages";

// Custom error class
class SocketError extends Error {
  constructor(public message: string, public details?: any) {
    super(message);
    this.name = "SocketError";
  }
}

export class Socket {
  private player1: WebSocket;
  private player2: WebSocket;
  public gameId: string;

  constructor(gameId: string, p1: WebSocket, p2: WebSocket) {
    this.player1 = p1;
    this.player2 = p2;
    this.gameId = gameId;
  }

  comparePlayer1(ws: WebSocket): boolean {
    return this.player1 === ws;
  }

  comparePlayer2(ws: WebSocket): boolean {
    return this.player2 === ws;
  }

  sendInitMsg(clockWhite: number, clockBlack: number) {
    try {
      const whitepayload: InitGamePayload = {
        t: INIT_GAME,
        d: {
          id: this.gameId,
          color: "white",
          clock: {
            w: clockWhite,
            b: clockBlack,
          },
        },
      };
      this.sendMessageToP1(whitepayload);
      this.sendMessageToP2({
        t: INIT_GAME,
        d: {
          id: this.gameId,
          color: "black",
          clock: {
            w: clockWhite,
            b: clockBlack,
          },
        },
      });
    } catch (error) {
      this.handleError(error, "Failed to send initialization message.");
    }
  }

  sendMove(
    m: GameMove,
    whiteClock: number,
    blackClock: number
  ): MovePayload | null {
    try {
      const payload: MovePayload = {
        t: MOVE,
        d: {
          san: m.san,
          f: m.after,
          t: m.time,
          c: m.color,
          ply: m.moveNumber,
          clock: {
            w: whiteClock,
            b: blackClock,
          },
        },
      };
      this.sendMessage(payload);
      return payload;
    } catch (error) {
      this.handleError(error, "Failed to send move message.");
      return null;
    }
  }

  sendDrawOffer(socket: WebSocket) {
    try {
      if (this.player1 === socket) {
        this.sendMessageToP2({
          t: DRAW_OFFERED,
          d: {
            color: "white",
          },
        });
      } else {
        this.sendMessageToP1({
          t: DRAW_OFFERED,
          d: {
            color: "black",
          },
        });
      }
    } catch (e) {
      this.handleError(e, "Failed to send draw offer");
    }
  }

  sendGameOverMsg(
    type: GameOverType,
    winner: Result,
    player1Time: number,
    player2Time: number
  ): GameOverPayload | null {
    try {
      const payload: GameOverPayload = {
        t: GAME_OVER,
        d: {
          type: type,
          msg: gameOverMessages[type],
          winner: winner,
          clock: {
            w: player1Time,
            b: player2Time,
          },
        },
      };
      this.sendMessage(payload);
      this.closeConnection();
      return payload;
    } catch (error) {
      this.handleError(error, "Failed to send Game Over message");
      return null;
    }
  }

  private sendMessage(payload: GameMessagePayload): boolean {
    const p = JSON.stringify(payload);
    try {
      this.player1.send(p);
      this.player2.send(p);
      return true;
    } catch (error) {
      this.handleError(error, "Failed to send message to both players.");
      return false;
    }
  }

  private sendMessageToP1(payload: GameMessagePayload): boolean {
    const p = JSON.stringify(payload);
    try {
      this.player1.send(p);
      return true;
    } catch (error) {
      this.handleError(error, "Failed to send message to player 1.");
      return false;
    }
  }

  private sendMessageToP2(payload: GameMessagePayload): boolean {
    const p = JSON.stringify(payload);
    try {
      this.player2.send(p);
      return true;
    } catch (error) {
      this.handleError(error, "Failed to send message to player 2.");
      return false;
    }
  }

  private closeConnection() {
    this.player1.close();
    this.player2.close();
  }

  private handleError(error: any, context: string) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(new SocketError(`${context} Error: ${errorMessage}`, error));
  }
}
