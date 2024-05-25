"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.TIME_LIMIT = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const crypto_1 = require("crypto");
// Time in milliseconds
exports.TIME_LIMIT = 10 * 60 * 1000; // 10 minutes
class Game {
    constructor(p1, p2, gameId) {
        var _a, _b;
        this.gameResult = null;
        this.gameStatus = "active";
        this.moveHistry = [];
        this.startTime = new Date(Date.now());
        this.lastMoveTime = new Date(Date.now());
        this.player1TimeConsumed = 0;
        this.player2TimeConsumed = 0;
        this.gameTimer = null;
        this.gameId = (0, crypto_1.randomUUID)();
        this.player1 = p1;
        this.player2 = p2;
        this.board = new chess_js_1.Chess();
        console.log("game created, message sending");
        (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            t: messages_1.INIT_GAME,
            d: {
                color: "white",
            },
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
            t: messages_1.INIT_GAME,
            d: {
                color: "black",
            },
        }));
        this.setGameTimer();
        console.log("send messages init_game");
    }
    makeMove(socket, move) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.board.turn() === "w" && socket !== this.player1) {
            console.log("not your turn w", this.board.turn());
            return;
        }
        if (this.board.turn() === "b" && socket !== this.player2) {
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
        this.moveHistry.push({
            m: m.san,
            f: m.after,
            t: currTime.getTime() - this.lastMoveTime.getTime(),
        }); // Pushing the move into move history.
        this.lastMoveTime = currTime;
        if (this.board.turn() === "w") {
            this.player2TimeConsumed += diff;
        }
        else {
            this.player1TimeConsumed += diff;
        }
        //TODO - send move to a kafka server for inserting into DB
        console.log(this.board.turn());
        if (this.board.turn() === "b") {
            (_a = this.player2) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                t: messages_1.MOVE,
                d: {
                    san: m.san,
                    f: m.after,
                    ply: this.moveHistry.length,
                },
                clock: {
                    white: this.player1TimeConsumed,
                    black: this.player2TimeConsumed,
                },
            }));
        }
        else {
            (_b = this.player1) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                t: messages_1.MOVE,
                d: {
                    san: m.san,
                    f: m.after,
                    ply: this.moveHistry.length,
                },
                clock: {
                    white: this.player1TimeConsumed,
                    black: this.player2TimeConsumed,
                },
            }));
        }
        if (this.board.isDraw()) {
            (_c = this.player1) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                t: messages_1.GAME_DRAW,
                d: {
                    winner: "draw",
                },
            }));
            (_d = this.player2) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                t: messages_1.GAME_DRAW,
                d: {
                    winner: "draw",
                },
            }));
        }
        if (this.board.isGameOver()) {
            if (this.board.isStalemate() ||
                this.board.isThreefoldRepetition() ||
                this.board.isInsufficientMaterial()) {
                (_e = this.player1) === null || _e === void 0 ? void 0 : _e.send(JSON.stringify({
                    t: messages_1.GAME_DRAW,
                    d: {
                        winner: "draw",
                    },
                }));
                (_f = this.player2) === null || _f === void 0 ? void 0 : _f.send(JSON.stringify({
                    t: messages_1.GAME_DRAW,
                    d: {
                        winner: "draw",
                    },
                }));
            }
            else {
                (_g = this.player1) === null || _g === void 0 ? void 0 : _g.send(JSON.stringify({
                    t: messages_1.GAME_OVER,
                    d: {
                        winner: this.board.turn() === "w" ? "white" : "black",
                    },
                }));
                (_h = this.player2) === null || _h === void 0 ? void 0 : _h.send(JSON.stringify({
                    t: messages_1.GAME_OVER,
                    d: {
                        winner: this.board.turn() === "w" ? "white" : "black",
                    },
                }));
            }
        }
    }
    gameEnd(type, msg) {
        var _a, _b;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            t: type,
            d: {
                winner: msg,
            },
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
            t: type,
            d: {
                winner: msg,
            },
        }));
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
            timeRemain = exports.TIME_LIMIT - this.player1TimeConsumed;
        }
        else {
            timeRemain = exports.TIME_LIMIT - this.player2TimeConsumed;
        }
        this.gameTimer = setTimeout(() => {
            console.log(turn === "w" ? "black" : "white", "timeout");
            this.gameEnd(messages_1.TIMEOUT, turn === "w" ? "black" : "white");
        }, timeRemain);
    }
    resign(socket) {
        if (socket === this.player1) {
            this.gameEnd(messages_1.GAME_OVER, "black");
        }
        else {
            this.gameEnd(messages_1.GAME_OVER, "white");
        }
    }
}
exports.Game = Game;
