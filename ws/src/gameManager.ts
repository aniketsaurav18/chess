import { WebSocket } from "ws";
import { Game } from "./game";
import cuid from "cuid";
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

const TimeLimitAllowed: number[] = [2, 5, 10, 15]; //minutes

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
        "An error occurred while initializing the game.",
        e,
        socket
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
            "Unknown message type.",
            new Error(`Unknown message type: ${msg.t}`),
            socket
          );
          break;
      }
    } catch (e: any) {
      this.handleError(
        "An error occurred while processing the message.",
        e,
        socket
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
        const match = TimeLimitAllowed.filter((t) => {
          t === timeLimit;
        });
        if (!match) {
          throw new Error("Time Limit now allowed");
        }
      } catch (e: any) {
        this.handleError("Invalid time limit", e, socket);
      }
      const gameId = await this.createGameDB(timeLimit, "IN_PROGRESS");
      const game = new Game(
        this.pendingUser,
        socket,
        this.producer,
        timeLimit,
        gameId
      );
      this.games.push(game);
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }

  private async createGameDB(
    timecontrol: number,
    status: "IN_PROGRESS" | "OPEN" | "FINISHED",
    whitePlayerId?: string,
    blackPlayerId?: string
  ): Promise<string> {
    const id = cuid();
    const column = ["id", "status", "timeControl"];
    const values = [id, status, timecontrol];
    const placeholder = ["$1", "$2", "$3"];

    if (whitePlayerId && blackPlayerId) {
      column.push("whitePlayerId");
      values.push(whitePlayerId);
      placeholder.push(`$${values.length}`);
      column.push("blackPlayerId");
      values.push(blackPlayerId);
      placeholder.push(`$${values.length}`);
    }

    try {
      const dbQuery = `INSERT INTO game (${column.join(
        ", "
      )}) VALUES (${placeholder.join(", ")}) RETURNING id`;
      const dbRes = await pool.query(dbQuery, values);

      if (dbRes.rows.length === 0) {
        this.handleError(
          "Initialization of game into DB failed",
          new Error("Game initialisation failed.")
        );
      }
      return dbRes.rows[0].id;
    } catch (e: any) {
      if (e.code === "23505") {
        this.handleError("Duplicate entry in game creation", e);
      } else {
        this.handleError("Unexpected error during game creation", e);
      }
      throw e;
    }
  }

  private async handleMove(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId); // TODO: convert this into map
    if (game) {
      await game.makeMove(socket, msg.d.m);
    } else {
      this.handleError("Game not found.", new Error("Game not found"), socket);
    }
  }

  private handleOfferDraw(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.handleDrawOffer(socket);
    } else {
      this.handleError("No Game Found", new Error("No Game Found"), socket);
    }
  }

  private handleResign(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.resign(socket);
    } else {
      this.handleError("Game not found.", new Error("Game not found"), socket);
    }
  }

  private handleDrawAccepted(socket: WebSocket, msg: any) {
    const game = this.games.find((game) => game.gameId === msg.d.gameId);
    if (game) {
      game.gameDraw();
    } else {
      this.handleError("Game not found.", new Error("Game not found"), socket);
    }
  }

  private handleError(errorMsg: string, error: Error, socket?: WebSocket) {
    console.error(error.message); // TODO: Send Log the error on the server
    socket?.send(
      JSON.stringify({
        t: ERR,
        d: {
          msg: errorMsg,
        },
      })
    );
  }
}
