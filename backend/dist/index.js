"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManager_1 = require("./gameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new gameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    console.log("client connected: ", ws);
    gameManager.addUser(ws);
    ws.on("disconnect", () => {
        gameManager.removeUser(ws);
    });
});
