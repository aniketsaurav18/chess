import { WebSocket } from "ws";
import { Game } from "./game";
import {
  DRAW_OFFERED,
  INIT_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  ERR,
  DRAW_ACCEPTED,
} from "./messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.handleInit(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private handleInit(socket: WebSocket) {
    try {
      socket.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        console.log("GameManager incoming message:", msg);
        this.handleMessage(socket, msg);
      });
    } catch (e: any) {
      this.handleError(
        socket,
        "An error occurred while initializing the game.",
        e
      );
    }
  }

  private handleMessage(socket: WebSocket, msg: any) {
    try {
      switch (msg.t) {
        case INIT_GAME:
          this.handleInitGame(socket, msg);
          break;
        case MOVE:
          this.handleMove(socket, msg);
          break;
        case OFFER_DRAW:
          this.handleOfferDraw(socket, msg);
          break;
        case RESIGN:
          this.handleResign(socket, msg);
          break;
        case DRAW_ACCEPTED:
          this.handleDrawAccepted(socket, msg);
          break;
        default:
          this.handleError(
            socket,
            "Unknown message type.",
            new Error(`Unknown message type: ${msg.t}`)
          );
          break;
      }
    } catch (e: any) {
      this.handleError(
        socket,
        "An error occurred while processing the message.",
        e
      );
    }
  }

  private handleInitGame(socket: WebSocket, msg: any) {
    if (this.pendingUser !== null) {
      const game = new Game(this.pendingUser, socket);
      this.games.push(game);
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }

  private handleMove(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.makeMove(socket, msg.d.m);
    } else {
      this.handleError(socket, "Game not found.", new Error("Game not found"));
    }
  }

  private handleOfferDraw(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.handleDrawOffer(socket);
    } else {
      this.handleError(socket, "No Game Found", new Error("No Game Found"));
    }
  }

  private handleResign(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.resign(socket);
    } else {
      this.handleError(socket, "Game not found.", new Error("Game not found"));
    }
  }

  private handleDrawAccepted(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.gameDraw();
    } else {
      this.handleError(socket, "Game not found.", new Error("Game not found"));
    }
  }

  private handleError(socket: WebSocket, errorMsg: string, error: Error) {
    console.error(error.message); // Log the error on the server
    socket.send(
      JSON.stringify({
        t: ERR,
        d: {
          msg: errorMsg,
        },
      })
    );
  }
}
