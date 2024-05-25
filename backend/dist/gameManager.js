"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.handleInit(socket);
    }
    removeUser(socket) {
        //logic to remove user;
        this.users.filter((user) => user !== socket);
    }
    handleInit(socket) {
        try {
            socket.on("message", (data) => {
                var _a, _b;
                const msg = JSON.parse(data.toString());
                console.log(msg);
                switch (msg.t) {
                    case messages_1.INIT_GAME:
                        if (this.pendingUser !== null) {
                            console.log("init game" + msg.t);
                            const game = new game_1.Game(this.pendingUser, socket);
                            this.games.push(game);
                            this.pendingUser = null;
                        }
                        else {
                            console.log("user added to pending user");
                            this.pendingUser = socket;
                        }
                        break;
                    case messages_1.MOVE:
                        console.log("move1" + msg.d.m);
                        const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                        if (game) {
                            game.makeMove(socket, msg.d.m);
                        }
                        else {
                            socket.send(JSON.stringify({
                                t: messages_1.ERR,
                                d: {
                                    msg: "Game not found",
                                },
                            }));
                        }
                        break;
                    case messages_1.OFFER_DRAW:
                        console.log("draw offered");
                        let g = this.games.find((game) => {
                            return game.player1 === socket || game.player2 === socket;
                        });
                        if (!g) {
                            socket.send(JSON.stringify({ t: messages_1.ERR, d: { msg: "No Game Found" } }));
                            break;
                        }
                        if ((g === null || g === void 0 ? void 0 : g.player1) === socket) {
                            (_a = g.player2) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ t: messages_1.DRAW_OFFERED, d: { color: "white" } }));
                        }
                        else {
                            (_b = g === null || g === void 0 ? void 0 : g.player1) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({ t: messages_1.DRAW_OFFERED, d: { color: "black" } }));
                        }
                        break;
                    case messages_1.RESIGN:
                        console.log("resign");
                        const resignGame = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                        if (!resignGame) {
                            socket.send(JSON.stringify({
                                t: messages_1.ERR,
                                d: { msg: "Game not found" },
                            }));
                            break;
                        }
                        resignGame.resign(socket);
                        break;
                    default:
                        console.log("Unknown message type: " + msg.t);
                        socket.send(JSON.stringify({
                            t: messages_1.ERR,
                            d: {
                                msg: "Unknown message type",
                            },
                        }));
                        break;
                }
            });
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.GameManager = GameManager;
