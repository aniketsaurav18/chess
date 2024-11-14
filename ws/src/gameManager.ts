import { WebSocket } from "ws";
import { Game } from "./game";
import {
  INIT_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  ERR,
  DRAW_ACCEPTED,
} from "./messages";
import Producer from "./kafka/producer";
import pool from "./db/db";

const TimeLimitAllowed: number[] = [2, 5, 10, 15] //minutes

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];
  private producer: Producer;

  constructor(producer: Producer) {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
    this.producer = producer;
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
      socket.on("message", async (data) => {
        const msg = JSON.parse(data.toString());
        console.log("GameManager incoming message:", msg);
        await this.handleMessage(socket, msg);
      });
    } catch (e: any) {
      this.handleError(
        socket,
        "An error occurred while initializing the game.",
        e
      );
    }
  }

  private async handleMessage(socket: WebSocket, msg: any) {
    try {
      switch (msg.t) {
        case INIT_GAME:
          await this.handleInitGame(socket, msg);
          break;
        case MOVE:
          await this.handleMove(socket, msg);
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
  private async handleInitGame(socket: WebSocket, msg: any) {
    // NOTE: time match match making is not being handled here. 
    // TODO: add a time based match making.
    if (this.pendingUser !== null) {
      let timeLimit = 10; //timelimit should be in minutes
      try {
        timeLimit = Number(msg.d.tl);
        const match =  TimeLimitAllowed.filter((t) => {t === timeLimit})
        if(!match){
          throw new Error("Time Limit now allowed")
        }
      } catch (e: any) {
        this.handleError(socket, "Invalid time limit", e)
      }
      const game = new Game(
        this.pendingUser,
        socket,
        this.producer,
        timeLimit
      );
      this.games.push(game);
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }

  private async createGameDB(timecontrol: number) {
    try{
      const dbRes = await pool.query("INSERT INTO Game (status, timecontrol) VALUE ($1, $2)", ["IN_PROGRESS", timecontrol])
    }
    
  }

  private async handleMove(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId); // TODO: convert this into map
    if (game) {
      await game.makeMove(socket, msg.d.m);
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
    console.error(error.message); // TODO: Send Log the error on the server
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
