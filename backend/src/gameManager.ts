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
    //logic to remove user;
    this.users.filter((user) => user !== socket);
  }
  private handleInit(socket: WebSocket) {
    try {
      socket.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        console.log(msg);
        switch (msg.t) {
          case INIT_GAME:
            if (this.pendingUser !== null) {
              console.log("init game" + msg.t);
              const game = new Game(this.pendingUser, socket);
              this.games.push(game);
              this.pendingUser = null;
            } else {
              console.log("user added to pending user");
              this.pendingUser = socket;
            }
            break;
          case MOVE:
            console.log("move1" + msg.d.m);
            const game = this.games.find(
              (game) => game.player1 === socket || game.player2 === socket
            );
            if (game) {
              game.makeMove(socket, msg.d.m);
            } else {
              socket.send(
                JSON.stringify({
                  t: ERR,
                  d: {
                    msg: "Game not found",
                  },
                })
              );
            }
            break;
          case OFFER_DRAW:
            console.log("draw offered");
            let g = this.games.find((game) => {
              return game.player1 === socket || game.player2 === socket;
            });
            if (!g) {
              socket.send(
                JSON.stringify({ t: ERR, d: { msg: "No Game Found" } })
              );
              break;
            }
            if (g?.player1 === socket) {
              g.player2?.send(
                JSON.stringify({ t: DRAW_OFFERED, d: { color: "white" } })
              );
            } else {
              g?.player1?.send(
                JSON.stringify({ t: DRAW_OFFERED, d: { color: "black" } })
              );
            }
            break;
          case RESIGN:
            console.log("resign");
            const resignGame = this.games.find(
              (game) => game.player1 === socket || game.player2 === socket
            );
            if (!resignGame) {
              socket.send(
                JSON.stringify({
                  t: ERR,
                  d: { msg: "Game not found" },
                })
              );
              break;
            }
            resignGame.resign(socket);
            break;
          case DRAW_ACCEPTED:
            console.log("draw accepted");
            const drawGame = this.games.find(
              (game) => game.player1 === socket || game.player2 === socket
            );
            if (!drawGame) {
              socket.send(
                JSON.stringify({
                  t: ERR,
                  d: { msg: "Game not found" },
                })
              );
              break;
            }
            drawGame.gameDraw();
            break;
          default:
            console.log("Unknown message type: " + msg.t);
            socket.send(
              JSON.stringify({
                t: ERR,
                d: {
                  msg: "Unknown message type",
                },
              })
            );
            break;
        }
      });
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
