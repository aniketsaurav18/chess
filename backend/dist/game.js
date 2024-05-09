"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(p1, p2) {
        var _a, _b;
        this.player1 = p1;
        this.player2 = p2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("game created, message sending");
        (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            }
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            }
        }));
        console.log("send messages init_game");
    }
    makeMode(socket, move) {
        var _a, _b, _c, _d;
        if ((this.board.turn() === "w") && (socket !== this.player1)) {
            return;
        }
        if ((this.board.turn() === "b") && (socket !== this.player2)) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white" : "black"
                }
            }));
            (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white" : "black"
                }
            }));
        }
        console.log(this.board.turn());
        if (this.board.turn() === "b") {
            (_c = this.player2) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            (_d = this.player1) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
    }
}
exports.Game = Game;
