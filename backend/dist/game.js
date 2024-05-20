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
    makeMove(socket, move) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if ((this.board.turn() === "w") && (socket !== this.player1)) {
            console.log("not your turn w", this.board.turn());
            return;
        }
        if ((this.board.turn() === "b") && (socket !== this.player2)) {
            console.log("not your turn b", this.board.turn());
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        console.log(this.board.turn());
        if (this.board.turn() === "b") {
            (_a = this.player2) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move
                },
            }));
        }
        else {
            (_b = this.player1) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move
                },
            }));
        }
        if (this.board.isDraw()) {
            (_c = this.player1) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                type: messages_1.GAME_DRAW,
                payload: {
                    winner: "draw"
                }
            }));
            (_d = this.player2) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                type: messages_1.GAME_DRAW,
                payload: {
                    winner: "draw"
                }
            }));
        }
        if (this.board.isGameOver()) {
            if (this.board.isStalemate() || this.board.isThreefoldRepetition() || this.board.isInsufficientMaterial()) {
                (_e = this.player1) === null || _e === void 0 ? void 0 : _e.send(JSON.stringify({
                    type: messages_1.GAME_DRAW,
                    payload: {
                        winner: "draw"
                    }
                }));
                (_f = this.player2) === null || _f === void 0 ? void 0 : _f.send(JSON.stringify({
                    type: messages_1.GAME_DRAW,
                    payload: {
                        winner: "draw"
                    }
                }));
            }
            else {
                (_g = this.player1) === null || _g === void 0 ? void 0 : _g.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "white" : "black"
                    }
                }));
                (_h = this.player2) === null || _h === void 0 ? void 0 : _h.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "white" : "black"
                    }
                }));
            }
        }
    }
}
exports.Game = Game;
